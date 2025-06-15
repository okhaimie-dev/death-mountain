import { getSettingsList, Settings } from '@/dojo/useGameSettings';
import { fetchMetadata } from '@/dojo/useGameTokens';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { GameAction, getEntityModel } from '@/types/game';
import { streamIds } from '@/utils/cloudflare';
import { BattleEvents, ExplorerLogEvents, ExplorerReplayEvents, formatGameEvent, GameEvent, getVideoId } from '@/utils/events';
import { getNewItemsEquipped } from '@/utils/game';
import { gameEventsQuery } from '@/utils/queries';
import { delay } from '@/utils/utils';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { createContext, PropsWithChildren, useContext, useEffect, useReducer, useState } from 'react';

export interface GameDirectorContext {
  executeGameAction: (action: GameAction) => void;
  actionFailed: number;
  subscription: any;
  videoQueue: string[];
  setVideoQueue: (videoQueue: string[]) => void;
}

const GameDirectorContext = createContext<GameDirectorContext>({} as GameDirectorContext);

const VRF_ENABLED = true;

/**
 * Wait times for events in milliseconds
*/
const delayTimes: any = {
  'attack': 2000,
  'beast_attack': 2000,
  'flee': 1000,
}

export const GameDirector = ({ children }: PropsWithChildren) => {
  const { sdk } = useDojoSDK();
  const { startGame, executeAction, requestRandom, explore, attack,
    flee, buyItems, selectStatUpgrades, equip, drop } = useSystemCalls();

  const { gameId, adventurer, adventurerState, setAdventurer, setBag, setBeast, setExploreLog, setBattleEvent, newInventoryItems,
    setMarketItemIds, setNewMarket, setNewInventoryItems, metadata, gameSettings, setGameSettings } = useGameStore();

  const [VRFEnabled, setVRFEnabled] = useState(VRF_ENABLED);
  const [spectating, setSpectating] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [actionFailed, setActionFailed] = useReducer(x => x + 1, 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventQueue, setEventQueue] = useState<GameEvent[]>([]);

  const [videoQueue, setVideoQueue] = useState<string[]>([]);

  useEffect(() => {
    if (gameId) {
      fetchMetadata(sdk, gameId);
    }
  }, [gameId]);

  useEffect(() => {
    if (gameId && metadata && !gameSettings) {
      getSettingsList(null, [metadata.settings_id]).then((settings: Settings[]) => {
        setGameSettings(settings[0])
        setVRFEnabled(settings[0].game_seed === 0);
        subscribeEvents(gameId!, settings[0]);
      })
    }
  }, [metadata, gameId]);

  useEffect(() => {
    if (!gameSettings || !adventurer || VRFEnabled) return;

    if (gameSettings.game_seed_until_xp !== 0 && adventurer.xp >= gameSettings.game_seed_until_xp) {
      setVRFEnabled(true);
    }
  }, [gameSettings, adventurer]);

  useEffect(() => {
    const processNextEvent = async () => {
      if (eventQueue.length > 0 && !isProcessing) {
        setIsProcessing(true);
        const event = eventQueue[0];
        await processEvent(event, false);
        setEventQueue(prev => prev.slice(1));
        setIsProcessing(false);
      }
    };

    processNextEvent();
  }, [eventQueue, isProcessing]);


  const subscribeEvents = async (gameId: number, settings: Settings) => {
    if (subscription) {
      subscription.cancel();
    }

    const [initialData, sub] = await sdk.subscribeEventQuery({
      query: gameEventsQuery(gameId),
      callback: ({ data, error }: { data?: any[]; error?: Error }) => {
        if (data && data.length > 0) {
          let events = data.filter((entity: any) => Boolean(getEntityModel(entity, "GameEvent")))
            .map((entity: any) => formatGameEvent(entity));

          setEventQueue(prev => [...prev, ...events]);
        }
      }
    });

    let events = (initialData?.getItems() || [])
      .filter((entity: any) => Boolean(getEntityModel(entity, "GameEvent")))
      .map((entity: any) => formatGameEvent(entity))
      .sort((a, b) => a.action_count - b.action_count);


    if (!events || events.length === 0) {
      startGame(gameId, (settings.game_seed === 0 && settings.adventurer.xp !== 0));
    } else {
      reconnectGameEvents(events);
    }

    setSubscription(sub);
  }

  const reconnectGameEvents = async (events: GameEvent[]) => {
    events.forEach(event => {
      processEvent(event, true);
    });
  }

  const processEvent = async (event: GameEvent, skipVideo: boolean) => {
    if (event.type === 'adventurer') {
      setAdventurer(event.adventurer!);
    }

    if (event.type === 'bag') {
      setBag(event.bag!.filter((item: any) => typeof item === 'object' && item.id !== 0));
    }

    if (event.type === 'beast') {
      setBeast(event.beast!);
    }

    if (event.type === 'market_items') {
      setMarketItemIds(event.items!);
      setNewMarket(true);
    }

    if (!spectating && ExplorerLogEvents.includes(event.type)) {
      if (!skipVideo && event.type === 'discovery') {
        if (event.discovery?.type === 'Loot') {
          setNewInventoryItems([...newInventoryItems, event.discovery.amount!]);
        }
      }

      setExploreLog(event);
    }

    if (spectating && ExplorerReplayEvents.includes(event.type)) {
      setExploreLog(event);
    }

    if (!skipVideo && BattleEvents.includes(event.type)) {
      setBattleEvent(event);
    }

    if (!skipVideo && (delayTimes[event.type])) {
      await delay(delayTimes[event.type]);
    }

    if (!skipVideo && getVideoId(event)) {
      setVideoQueue(prev => [...prev.filter((id, index) => index === 0 || id !== streamIds.explore), getVideoId(event)!]);
    }
  }

  const executeGameAction = (action: GameAction) => {
    let txs: any[] = [];

    if (VRFEnabled && ['explore', 'attack', 'flee'].includes(action.type)) {
      txs.push(requestRandom());
    }

    if (VRFEnabled && action.type === 'equip' && adventurer?.beast_health! > 0) {
      txs.push(requestRandom());
    }

    let newItemsEquipped = getNewItemsEquipped(adventurer?.equipment!, adventurerState?.equipment!);
    if (action.type !== 'equip' && newItemsEquipped.length > 0) {
      txs.push(equip(gameId!, newItemsEquipped.map(item => item.id)));
    }

    if (action.type === 'explore') {
      txs.push(explore(gameId!, action.untilBeast!));
    } else if (action.type === 'attack') {
      txs.push(attack(gameId!, action.untilDeath!));
    } else if (action.type === 'flee') {
      txs.push(flee(gameId!, action.untilDeath!));
    } else if (action.type === 'buy_items') {
      txs.push(buyItems(gameId!, action.potions!, action.itemPurchases!));
    } else if (action.type === 'select_stat_upgrades') {
      txs.push(selectStatUpgrades(gameId!, action.statUpgrades!));
    } else if (action.type === 'equip') {
      txs.push(equip(gameId!, newItemsEquipped.map(item => item.id)));
    } else if (action.type === 'drop') {
      txs.push(drop(gameId!, action.items!));
    }

    executeAction(txs, setActionFailed);
  }

  return (
    <GameDirectorContext.Provider value={{
      executeGameAction,
      actionFailed,
      subscription,
      videoQueue,
      setVideoQueue,
    }}>
      {children}
    </GameDirectorContext.Provider>
  );
};

export const useGameDirector = () => {
  return useContext(GameDirectorContext);
};


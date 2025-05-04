import { fetchMetadata } from '@/dojo/useGameTokens';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { GameAction, getEntityModel } from '@/types/game';
import { BattleEvents, ExplorerLogEvents, formatGameEvent } from '@/utils/events';
import { gameEventsQuery } from '@/utils/queries';
import { delay } from '@/utils/utils';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

const GameDirectorContext = createContext({
  reconnecting: false,
  executeGameAction: (action: GameAction) => { },
});

/**
 * Wait times for events in milliseconds
 */
const explorerDelay = 1000;
const delayTimes: any = {
  'level_up': explorerDelay,
  'discovery': explorerDelay,
  'obstacle': explorerDelay,
  'attack': 2000,
  'beast_attack': 2000,
  'flee': 1000,
}
const VRF_ENABLED = false;

export const GameDirector = ({ children }: PropsWithChildren) => {
  const { sdk } = useDojoSDK();
  const { startGame, executeAction, requestRandom, explore, attack,
    flee, buyItems, selectStatUpgrades, equip, drop } = useSystemCalls();

  const { gameId, adventurer, setAdventurer, setBag, setBeast, setExploreLog,
    setBattleEvent, equipItems, dropItems, setMarketSeed, setNewMarket } = useGameStore();

  const [spectating, setSpectating] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [reconnecting, setReconnecting] = useState(false);
  const [eventQueue, setEventQueue] = useState<any[]>([]);

  useEffect(() => {
    if (gameId) {
      subscribeEvents(gameId);
      fetchMetadata(sdk, gameId);
    }
  }, [gameId]);

  useEffect(() => {
    if (eventQueue.length > 0) {
      const event = eventQueue[0];
      processEvent(event);
    }
  }, [eventQueue]);

  const subscribeEvents = async (gameId: number) => {
    if (subscription) {
      subscription.cancel();
    }

    setReconnecting(true);

    const [initialData, sub] = await sdk.subscribeEventQuery({
      query: gameEventsQuery(gameId),
      historical: true,
      callback: ({ data, error }: { data?: any[]; error?: Error }) => {
        if (data && data.length > 0) {
          let events = data.filter((entity: any) => Boolean(getEntityModel(entity, "GameEvent")));
          setEventQueue(prev => [...prev, ...events]);
        }
      }
    });

    if (initialData && initialData.length === 0) {
      startGame(gameId);
      setReconnecting(false);
    } else {
      reconnectGameEvents(initialData.reverse());
    }

    setSubscription(sub);
  }

  const reconnectGameEvents = async (entities: any[]) => {
    let events = entities.filter((entity: any) => Boolean(getEntityModel(entity, "GameEvent")));

    events.forEach(entity => {
      processEvent(entity);
    });

    setReconnecting(false);
  }

  const processEvent = async (entity: any) => {
    let event = formatGameEvent(entity);

    if (event.type === 'adventurer') {
      setAdventurer(event.adventurer!);

      if (event.adventurer?.beast_health === 0) {
        setBeast(null);
        setBattleEvent(null);
      }
    }

    if (event.type === 'bag') {
      setBag(event.bag!);
    }

    if (event.type === 'beast') {
      setBeast(event.beast!);
    }

    if (event.type === 'level_up') {
      setMarketSeed(event.market_seed!);
      setNewMarket(true);
    }

    if (ExplorerLogEvents.includes(event.type)) {
      setExploreLog(event);
    }

    if (BattleEvents.includes(event.type)) {
      setBattleEvent(event);
    }

    if (!reconnecting && delayTimes[event.type]) {
      await delay(delayTimes[event.type]);
    }

    setEventQueue(prev => prev.slice(1));
  }

  const executeGameAction = (action: GameAction) => {
    if (spectating) return;

    let txs: any[] = [];

    if (equipItems.length > 0) {
      if (VRF_ENABLED && adventurer?.beast_health! > 0) {
        txs.push(requestRandom());
      }

      txs.push(equip(gameId!, equipItems.map(item => item.id)));
    }

    if (dropItems.length > 0) {
      txs.push(drop(gameId!, dropItems.map(item => item.id)));
    }

    if (VRF_ENABLED && ['explore', 'attack', 'flee'].includes(action.type)) {
      txs.push(requestRandom());
    }

    if (action.type === 'explore') {
      txs.push(explore(gameId!, action.untilBeast!));
    } else if (action.type === 'attack') {
      txs.push(attack(gameId!, action.untilDeath!));
    } else if (action.type === 'flee') {
      txs.push(flee(gameId!, action.untilDeath!));
    } else if (action.type === 'buy_items') {
      txs.push(buyItems(gameId!, action.potions!, action.items!));
    } else if (action.type === 'select_stat_upgrades') {
      txs.push(selectStatUpgrades(gameId!, action.statUpgrades!));
    }

    executeAction(txs);
  }

  return (
    <GameDirectorContext.Provider value={{
      reconnecting,
      executeGameAction,
    }}>
      {children}
    </GameDirectorContext.Provider>
  );
};

export const useGameDirector = () => {
  return useContext(GameDirectorContext);
};


import { fetchMetadata } from '@/dojo/useGameTokens';
import { useSystemCalls } from '@/dojo/useSystemCalls';
import { useGameStore } from '@/stores/gameStore';
import { GameAction, getEntityModel } from '@/types/game';
import { BattleEvents, ExplorerLogEvents, formatGameEvent } from '@/utils/events';
import { calculateLevel, getNewItemsEquipped } from '@/utils/game';
import { gameEventsQuery } from '@/utils/queries';
import { delay } from '@/utils/utils';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';

const GameDirectorContext = createContext({
  executeGameAction: (action: GameAction) => { },
  setPlaying: (playing: boolean) => { },
  playing: false,
});

/**
 * Wait times for events in milliseconds
*/
const delayTimes: any = {
  'level_up': 1000,
  'discovery': 1000,
  'obstacle': 1000,
  'attack': 2000,
  'beast_attack': 2000,
  'flee': 1000,
}

const tracks: any = {
  Intro: "/audio/Intro.mp3",
  Death: "/audio/Game-Ending.mp3",
  Beginning: "/audio/Quest-Journey-Music.mp3",
  Early: "/audio/Vault-Of-Whispers.mp3",
  RampUp: "/audio/Torchlit-Passage.mp3",
  Mid: "/audio/Trap-Door.mp3",
  Late: "/audio/Courage.mp3",
  SuperLate: "/audio/Hall-Of-A-Thousand-Eyes.mp3",
}

const VRF_ENABLED = true;

export const GameDirector = ({ children }: PropsWithChildren) => {
  const { sdk } = useDojoSDK();
  const { startGame, executeAction, requestRandom, explore, attack,
    flee, buyItems, selectStatUpgrades, equip, drop } = useSystemCalls();

  const { gameId, adventurer, adventurerState, setAdventurer, setBag, setBeast, setExploreLog, setBattleEvent, newInventoryItems,
    setMarketItemIds, setNewMarket, setNewInventoryItems } = useGameStore();

  const [spectating, setSpectating] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventQueue, setEventQueue] = useState<any[]>([]);

  const audioRef = useRef(new Audio(tracks.Intro));
  audioRef.current.loop = true;
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const handleFirstInteraction = () => {
      audioRef.current.play().catch(() => { });
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    playing ? audioRef.current.play().catch(() => { }) : audioRef.current.pause();
  }, [playing]);

  useEffect(() => {
    let newTrack = null;
    if (!gameId || !adventurer) {
      newTrack = tracks.Intro;
    } else {
      if (adventurer.health === 0) {
        newTrack = tracks.Death;
      } else {
        const level = calculateLevel(adventurer.xp);
        if (level < 3) {
          newTrack = tracks.Beginning;
        } else if (level < 6) {
          newTrack = tracks.Early;
        } else if (level < 9) {
          newTrack = tracks.RampUp;
        } else if (level < 15) {
          newTrack = tracks.Mid;
        } else if (level < 25) {
          newTrack = tracks.Late;
        } else {
          newTrack = tracks.SuperLate;
        }
      }
    }

    if (newTrack && newTrack !== new URL(audioRef.current.src).pathname) {
      audioRef.current.src = newTrack;
      if (playing) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  }, [gameId, adventurer, playing]);

  useEffect(() => {
    if (gameId) {
      subscribeEvents(gameId);
      fetchMetadata(sdk, gameId);
    }
  }, [gameId]);

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

  const subscribeEvents = async (gameId: number) => {
    if (subscription) {
      subscription.cancel();
    }

    const [initialData, sub] = await sdk.subscribeEventQuery({
      query: gameEventsQuery(gameId),
      callback: ({ data, error }: { data?: any[]; error?: Error }) => {
        if (data && data.length > 0) {
          let events = data.filter((entity: any) => Boolean(getEntityModel(entity, "GameEvent")));
          setEventQueue(prev => [...prev, ...events]);
        }
      }
    });

    if (initialData?.getItems() && initialData.getItems().length === 0) {
      startGame(gameId);
    } else {
      reconnectGameEvents(initialData.getItems());
    }

    setSubscription(sub);
  }

  const reconnectGameEvents = async (entities: any[]) => {
    let events = entities.filter((entity: any) => Boolean(getEntityModel(entity, "GameEvent")));

    events.forEach(entity => {
      processEvent(entity, true);
    });
  }

  const processEvent = async (entity: any, reconnecting: boolean) => {
    let event = formatGameEvent(entity);

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

    if (ExplorerLogEvents.includes(event.type)) {
      if (!reconnecting && event.type === 'discovery') {
        if (event.discovery?.type === 'Loot') {
          setNewInventoryItems([...newInventoryItems, event.discovery.amount!]);
        }
      }

      setExploreLog(event);
    }

    if (!reconnecting && BattleEvents.includes(event.type)) {
      setBattleEvent(event);
    }

    if (!reconnecting && delayTimes[event.type]) {
      await delay(delayTimes[event.type]);
    }
  }

  const executeGameAction = (action: GameAction) => {
    if (spectating) return;

    let txs: any[] = [];

    if (VRF_ENABLED && ['explore', 'attack', 'flee'].includes(action.type)) {
      txs.push(requestRandom());
    }

    if (VRF_ENABLED && action.type === 'equip' && adventurer?.beast_health! > 0) {
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

    executeAction(txs);
  }

  return (
    <GameDirectorContext.Provider value={{
      executeGameAction,
      setPlaying,
      playing,
    }}>
      {children}
    </GameDirectorContext.Provider>
  );
};

export const useGameDirector = () => {
  return useContext(GameDirectorContext);
};


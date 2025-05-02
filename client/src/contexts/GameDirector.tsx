import { useGameStore } from '@/stores/gameStore';
import { gameEventsQuery } from '@/utils/queries';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

const GameDirectorContext = createContext({});

export const GameDirector = ({ children }: PropsWithChildren) => {
  const { sdk } = useDojoSDK();
  const { gameId } = useGameStore();

  const [subscription, setSubscription] = useState<any>(null);
  const [eventQueue, setEventQueue] = useState<Event[]>([]);

  useEffect(() => {
    if (gameId) {
      subscribeEvents(gameId);
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

    const [initialData, sub] = await sdk.subscribeEventQuery({
      query: gameEventsQuery(gameId),
      historical: true,
      callback: (data: any) => setEventQueue(prev => [...prev, data ?? []])
    });

    setSubscription(sub);
  }

  const processEvent = (event: any) => {
    console.log(event);
    setEventQueue(prev => prev.slice(1));
  }

  return (
    <GameDirectorContext.Provider value={{}}>
      {children}
    </GameDirectorContext.Provider>
  );
};

export const useGameDirector = () => {
  return useContext(GameDirectorContext);
};


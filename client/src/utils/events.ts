import { getEntityModel } from "@/types/game";

export interface BattleEvent {
  number: number;
  type: string;
  damage?: number;
  location?: string;
  critical?: boolean;
  success?: boolean;
}

export interface ExploreEvent {
  number: number;
  type: string;
  damage?: number;
  location?: string;
  critical?: boolean;
  xp_reward?: number;
  discovery_type?: {
    variant: {
      Gold?: number;
      Health?: number;
      Loot?: number;
    };
  };
  dodged?: boolean;
  gold_reward?: number;
  stats?: any;
  potions?: number;
  items_purchased?: any[];
  items?: any[];
  level?: number;
}

export const formatBattleEvent = (entities: any): BattleEvent[] => {
  entities = entities.filter((entity: any) => Boolean(getEntityModel(entity, "BattleEvent")));

  let battleEvents: BattleEvent[] = entities.map((entity: any) => {
    let event = getEntityModel(entity, "BattleEvent")
    const { action_count, details } = event;

    if (details.variant.attack) {
      const attack = details.variant.attack;
      return {
        number: action_count,
        type: 'attack',
        damage: attack.damage,
        location: 'None',
        critical: attack.critical_hit
      };
    }

    if (details.variant.beast_attack) {
      const beastAttack = details.variant.beast_attack;
      return {
        number: action_count,
        type: 'beast_attack',
        damage: beastAttack.damage,
        location: beastAttack.location,
        critical: beastAttack.critical_hit
      };
    }

    if (details.variant.flee) {
      return {
        number: action_count,
        type: 'flee',
        success: details.variant.flee
      };
    }

    if (details.variant.ambush) {
      const ambush = details.variant.ambush;
      return {
        number: action_count,
        type: 'ambush',
        damage: ambush.damage,
        location: ambush.location,
        critical: ambush.critical_hit,
      };
    }
  });

  return battleEvents.sort((a, b) => a.number - b.number);
};

export const formatExploreEvent = (entities: any): ExploreEvent[] => {
  entities = entities.filter((entity: any) => Boolean(getEntityModel(entity, "GameEvent")));

  let exploreEvents: ExploreEvent[] = entities.map((entity: any) => {
    let event = getEntityModel(entity, "GameEvent")
    const { action_count, details } = event;

    if (details.variant.discovery) {
      const discovery = details.variant.discovery;
      return {
        number: action_count,
        type: 'discovery',
        xp_reward: discovery.xp_reward,
        discovery_type: discovery.discovery_type
      };
    }

    if (details.variant.obstacle) {
      const obstacle = details.variant.obstacle;
      return {
        number: action_count,
        type: 'obstacle',
        damage: obstacle.damage,
        location: obstacle.location,
        critical: obstacle.critical_hit,
        xp_reward: obstacle.xp_reward,
        dodged: obstacle.dodged
      };
    }

    if (details.variant.defeated_beast) {
      const beast = details.variant.defeated_beast;
      return {
        number: action_count,
        type: 'defeated_beast',
        gold_reward: beast.gold_reward,
        xp_reward: beast.xp_reward
      };
    }

    if (details.variant.fled_beast) {
      const beast = details.variant.fled_beast;
      return {
        number: action_count,
        type: 'fled_beast',
        xp_reward: beast.xp_reward
      };
    }

    if (details.variant.stat_upgrade) {
      const upgrade = details.variant.stat_upgrade;
      return {
        number: action_count,
        type: 'stat_upgrade',
        stats: upgrade.stats
      };
    }

    if (details.variant.market) {
      const market = details.variant.market;
      return {
        number: action_count,
        type: 'market',
        potions: market.potions,
        items_purchased: market.items_purchased
      };
    }

    if (details.variant.equip) {
      const equip = details.variant.equip;
      return {
        number: action_count,
        type: 'equip',
        items: equip.items
      };
    }

    if (details.variant.drop) {
      const drop = details.variant.drop;
      return {
        number: action_count,
        type: 'drop',
        items: drop.items
      };
    }

    if (details.variant.level_up) {
      const levelUp = details.variant.level_up;
      return {
        number: action_count,
        type: 'level_up',
        level: levelUp.level
      };
    }
  });

  return exploreEvents.sort((a, b) => a.number - b.number);
};
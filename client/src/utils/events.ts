import { getEntityModel } from "@/types/game";
import { getBeastName, getBeastTier, getBeastType } from "./beast";

export interface BattleEvent {
  type: string;
  damage?: number;
  location?: string;
  critical?: boolean;
  success?: boolean;
}

export interface ExploreEvent {
  type: string;
  damage?: number;
  location?: string;
  critical?: boolean;
  xp_reward?: number;
  obstacle_id?: number;
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
  beast_id?: number;
  beast_seed?: number;
  beast_health?: number;
  beast_level?: number;
  beast_type?: string;
  beast_tier?: string;
}

export const formatBattleEvent = (entities: any): BattleEvent[] => {
  entities = entities.filter((entity: any) => Boolean(getEntityModel(entity, "BattleEvent")));

  let battleEvents: BattleEvent[] = entities.map((entity: any) => {
    let event = getEntityModel(entity, "BattleEvent")
    const { details } = event;

    if (details.variant.attack) {
      const attack = details.variant.attack;
      return {
        type: 'attack',
        damage: attack.damage,
        location: 'None',
        critical: attack.critical_hit
      };
    }

    if (details.variant.beast_attack) {
      const beastAttack = details.variant.beast_attack;
      return {
        type: 'beast_attack',
        damage: beastAttack.damage,
        location: beastAttack.location,
        critical: beastAttack.critical_hit
      };
    }

    if ('flee' in details.variant) {
      return {
        type: 'flee',
        success: details.variant.flee
      };
    }

    if (details.variant.ambush) {
      const ambush = details.variant.ambush;
      return {
        type: 'ambush',
        damage: ambush.damage,
        location: ambush.location,
        critical: ambush.critical_hit,
      };
    }
  });

  return battleEvents
};

export const formatExploreEvent = (entities: any): ExploreEvent[] => {
  entities = entities.filter((entity: any) => Boolean(getEntityModel(entity, "GameEvent")));

  let exploreEvents: ExploreEvent[] = entities.map((entity: any) => {
    let event = getEntityModel(entity, "GameEvent")
    const { details } = event;

    if (details.variant.beast) {
      const beast = details.variant.beast;
      return {
        type: 'beast',
        beast_id: beast.id,
        beast_name: getBeastName(beast.id, beast.level, beast.specials.special2, beast.specials.special3),
        beast_seed: beast.seed,
        beast_health: beast.health,
        beast_level: beast.level,
        beast_type: getBeastType(beast.id),
        beast_tier: getBeastTier(beast.id)
      };
    }

    if (details.variant.discovery) {
      const discovery = details.variant.discovery;
      return {
        type: 'discovery',
        xp_reward: discovery.xp_reward,
        discovery_type: discovery.discovery_type
      };
    }

    if (details.variant.obstacle) {
      const obstacle = details.variant.obstacle;
      return {
        type: 'obstacle',
        obstacle_id: obstacle.obstacle_id,
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
        type: 'defeated_beast',
        gold_reward: beast.gold_reward,
        xp_reward: beast.xp_reward
      };
    }

    if (details.variant.fled_beast) {
      const beast = details.variant.fled_beast;
      return {
        type: 'fled_beast',
        xp_reward: beast.xp_reward
      };
    }

    if (details.variant.stat_upgrade) {
      const upgrade = details.variant.stat_upgrade;
      return {
        type: 'stat_upgrade',
        stats: upgrade.stats
      };
    }

    if (details.variant.market) {
      const market = details.variant.market;
      return {
        type: 'market',
        potions: market.potions,
        items_purchased: market.items_purchased
      };
    }

    if (details.variant.equip) {
      const equip = details.variant.equip;
      return {
        type: 'equip',
        items: equip.items
      };
    }

    if (details.variant.drop) {
      const drop = details.variant.drop;
      return {
        type: 'drop',
        items: drop.items
      };
    }

    if (details.variant.level_up) {
      const levelUp = details.variant.level_up;
      return {
        type: 'level_up',
        level: levelUp.level
      };
    }
  });

  return exploreEvents
};
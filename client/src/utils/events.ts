import { OBSTACLE_NAMES } from "@/constants/obstacle";
import { Adventurer, Attack, Beast, Item, ItemPurchase, Obstacle, Stats, getEntityModel } from "@/types/game";
import adventurerImg from '../assets/images/adventurer.png';
import barrierImg from '../assets/images/barrier.png';
import goldImg from '../assets/images/gold.png';
import healthImg from '../assets/images/health.png';
import marketImg from '../assets/images/market.png';
import upgrade from '../assets/images/upgrade.png';
import { getBeastImageById, getBeastName, getBeastTier, getBeastType } from "./beast";
import { ItemUtils } from "./loot";
import { BEAST_NAME_PREFIXES, BEAST_NAME_SUFFIXES, BEAST_NAMES, BEAST_SPECIAL_NAME_LEVEL_UNLOCK } from "@/constants/beast";

export interface GameEvent {
  type: 'adventurer' | 'bag' | 'beast' | 'discovery' | 'obstacle' | 'defeated_beast' | 'fled_beast' | 'stat_upgrade' |
  'buy_items' | 'equip' | 'drop' | 'level_up' | 'market_items' | 'ambush' | 'attack' | 'beast_attack' | 'flee' | 'unknown';
  adventurer?: Adventurer;
  bag?: Item[];
  beast?: Beast;
  discovery?: {
    type: 'Gold' | 'Health' | 'Loot';
    amount: number;
  }
  obstacle?: Obstacle;
  stats?: Stats;
  attack?: Attack;

  xp_reward?: number;
  gold_reward?: number;

  beast_id?: number;
  potions?: number;
  items_purchased?: ItemPurchase[];
  items?: number[];
  market_seed?: bigint;
  level?: number;
  success?: boolean;

}

export const formatGameEvent = (entity: any): GameEvent => {
  let event = getEntityModel(entity, "GameEvent")
  const { details } = event;

  if ('adventurer' in details.variant) {
    return {
      type: 'adventurer',
      adventurer: details.variant.adventurer
    };
  }

  else if ('bag' in details.variant) {
    return {
      type: 'bag',
      bag: Object.values(details.variant.bag)
    };
  }

  else if ('beast' in details.variant) {
    const beast = details.variant.beast;
    return {
      type: 'beast',
      beast: {
        id: beast.id,
        baseName: BEAST_NAMES[beast.id],
        name: getBeastName(beast.id, beast.level, beast.specials.special2, beast.specials.special3),
        health: beast.health,
        level: beast.level,
        type: getBeastType(beast.id),
        tier: getBeastTier(beast.id),
        specialPrefix: beast.level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK ? BEAST_NAME_PREFIXES[beast.specials.special2] : null,
        specialSuffix: beast.level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK ? BEAST_NAME_SUFFIXES[beast.specials.special3] : null
      }
    };
  }

  else if ('discovery' in details.variant) {
    const discovery = details.variant.discovery;
    return {
      type: 'discovery',
      discovery: {
        type: Object.keys(discovery.discovery_type.variant)[0] as 'Gold' | 'Health' | 'Loot',
        amount: Object.values(discovery.discovery_type.variant)[0] as number,
      },
      xp_reward: discovery.xp_reward
    };
  }

  else if ('obstacle' in details.variant) {
    const obstacle = details.variant.obstacle;
    return {
      type: 'obstacle',
      xp_reward: obstacle.xp_reward,
      obstacle: {
        id: obstacle.obstacle_id,
        damage: obstacle.damage,
        location: obstacle.location,
        critical_hit: obstacle.critical_hit,
        dodged: obstacle.dodged
      }
    };
  }

  else if ('defeated_beast' in details.variant) {
    const beast = details.variant.defeated_beast;
    return {
      type: 'defeated_beast',
      beast_id: beast.beast_id,
      gold_reward: beast.gold_reward,
      xp_reward: beast.xp_reward
    };
  }

  else if ('fled_beast' in details.variant) {
    const beast = details.variant.fled_beast;
    return {
      type: 'fled_beast',
      beast_id: beast.beast_id,
      xp_reward: beast.xp_reward
    };
  }

  else if ('stat_upgrade' in details.variant) {
    const upgrade = details.variant.stat_upgrade;
    return {
      type: 'stat_upgrade',
      stats: upgrade.stats
    };
  }

  else if ('buy_items' in details.variant) {
    const buy_items = details.variant.buy_items;
    return {
      type: 'buy_items',
      potions: buy_items.potions,
      items_purchased: buy_items.items_purchased
    };
  }

  else if ('equip' in details.variant) {
    const equip = details.variant.equip;
    return {
      type: 'equip',
      items: equip.items
    };
  }

  else if ('drop' in details.variant) {
    const drop = details.variant.drop;
    return {
      type: 'drop',
      items: drop.items
    };
  }

  else if ('level_up' in details.variant) {
    const levelUp = details.variant.level_up;
    return {
      type: 'level_up',
      level: levelUp.level,
    };
  }

  else if ('market_items' in details.variant) {
    const marketItems = details.variant.market_items;
    return {
      type: 'market_items',
      items: marketItems.items
    };
  }

  else if ('attack' in details.variant) {
    const attack = details.variant.attack;
    return {
      type: 'attack',
      attack: {
        damage: attack.damage,
        location: 'None',
        critical_hit: attack.critical_hit
      }
    };
  }

  else if ('beast_attack' in details.variant) {
    const beastAttack = details.variant.beast_attack;
    return {
      type: 'beast_attack',
      attack: {
        damage: beastAttack.damage,
        location: beastAttack.location,
        critical_hit: beastAttack.critical_hit
      }
    };
  }

  else if ('flee' in details.variant) {
    return {
      type: 'flee',
      success: details.variant.flee
    };
  }

  else if ('ambush' in details.variant) {
    const ambush = details.variant.ambush;
    return {
      type: 'ambush',
      attack: {
        damage: ambush.damage,
        location: ambush.location,
        critical_hit: ambush.critical_hit,
      }
    };
  }

  return { type: 'unknown' };
};

export const ExplorerLogEvents = [
  'discovery',
  'obstacle',
  'defeated_beast',
  'fled_beast',
  'stat_upgrade',
  'buy_items',
  'level_up',
]

export const BattleEvents = [
  'attack',
  'beast_attack',
  'flee',
  'ambush'
]

export const getEventIcon = (event: GameEvent) => {
  switch (event.type) {
    case 'discovery':
      if (event.discovery?.type === 'Gold') return goldImg;
      if (event.discovery?.type === 'Health') return healthImg;
      if (event.discovery?.type === 'Loot') return ItemUtils.getItemImage(event.discovery?.amount!);
    case 'obstacle':
      return barrierImg;
    case 'defeated_beast':
      return getBeastImageById(event.beast_id!);
    case 'fled_beast':
      return getBeastImageById(event.beast_id!);
    case 'stat_upgrade':
      return adventurerImg;
    case 'level_up':
      return upgrade;
    case 'buy_items':
      return marketImg;
    default:
      return adventurerImg;
  }
};

export const getEventTitle = (event: GameEvent) => {
  switch (event.type) {
    case 'beast':
      return `Encountered beast`;
    case 'discovery':
      if (event.discovery?.type === 'Gold') return 'Discovered Gold';
      if (event.discovery?.type === 'Health') return 'Discovered Health';
      if (event.discovery?.type === 'Loot') return `Discovered ${ItemUtils.getItemName(event.discovery?.amount!)}`;
      return 'Discovered Unknown';
    case 'obstacle':
      const location = event.obstacle?.location || 'None';
      const obstacleName = OBSTACLE_NAMES[event.obstacle?.id!] || 'Unknown Obstacle';
      if (event.obstacle?.dodged) {
        return `Avoided ${obstacleName}`;
      }
      return `${obstacleName} hit your ${location}`;
    case 'defeated_beast':
      return 'Defeated Beast';
    case 'fled_beast':
      return 'Fled from Beast';
    case 'level_up':
      return 'Level Up';
    case 'stat_upgrade':
      return 'Stats Upgraded';
    case 'buy_items':
      return 'Visited Market';
    default:
      return 'Unknown Event';
  }
};
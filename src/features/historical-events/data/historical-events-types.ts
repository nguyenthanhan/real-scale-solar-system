// Historical Events Type Definitions

export type EventCategory =
  | "solar-eclipse"
  | "lunar-eclipse"
  | "planetary-conjunction"
  | "space-mission"
  | "meteor-shower";

export interface BaseHistoricalEvent {
  id: string;
  name: string;
  date: Date;
  description: string;
  category: EventCategory;
}

export interface SolarEclipseEvent extends BaseHistoricalEvent {
  category: "solar-eclipse";
  eclipseType: "total" | "partial" | "annular" | "hybrid";
  visibilityRegion: string;
}

export interface LunarEclipseEvent extends BaseHistoricalEvent {
  category: "lunar-eclipse";
  eclipseType: "total" | "partial" | "penumbral";
  duration: string;
}

export interface PlanetaryConjunctionEvent extends BaseHistoricalEvent {
  category: "planetary-conjunction";
  planets: string[];
  angularSeparation: number; // in degrees
}

export interface SpaceMissionEvent extends BaseHistoricalEvent {
  category: "space-mission";
  missionName: string;
  achievement: string;
  agency: string;
}

export interface MeteorShowerEvent extends BaseHistoricalEvent {
  category: "meteor-shower";
  peakRate: number; // meteors per hour
  parentBody: string;
}

export type HistoricalEvent =
  | SolarEclipseEvent
  | LunarEclipseEvent
  | PlanetaryConjunctionEvent
  | SpaceMissionEvent
  | MeteorShowerEvent;

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  "solar-eclipse": "Solar Eclipses",
  "lunar-eclipse": "Lunar Eclipses",
  "planetary-conjunction": "Planetary Conjunctions",
  "space-mission": "Space Missions",
  "meteor-shower": "Meteor Showers",
};

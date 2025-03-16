/**
 * Interface für den Agent-Kontext
 */
export interface AgentContext {
  logger: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    debug: (message: string) => void;
  };
  [key: string]: any;
}

/**
 * Interface für das Ergebnis eines Agenten
 */
export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: string | any;
  message?: string;
}

/**
 * Basisklasse für alle Agenten
 */
export abstract class BaseAgent<InputType = any, OutputType = any> {
  protected name: string;

  /**
   * Konstruktor für BaseAgent
   * @param name Name des Agenten
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Gibt den Namen des Agenten zurück
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Abstrakte Methode, die von allen Agenten implementiert werden muss
   * @param input Eingabedaten für den Agenten
   * @param context Kontext für die Ausführung
   */
  public abstract execute(
    input: InputType,
    context: AgentContext
  ): Promise<AgentResult<OutputType>>;

  /**
   * Erstellt einen Standard-Kontext mit Logger
   */
  protected createDefaultContext(): AgentContext {
    return {
      logger: {
        info: (message: string) => console.log(`[${this.name}] INFO: ${message}`),
        warn: (message: string) => console.warn(`[${this.name}] WARN: ${message}`),
        error: (message: string) => console.error(`[${this.name}] ERROR: ${message}`),
        debug: (message: string) => console.debug(`[${this.name}] DEBUG: ${message}`),
      }
    };
  }
} 
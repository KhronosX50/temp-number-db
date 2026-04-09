export interface TempNumber {
  id: string;
  number: string;
  country: string;
  messages: Message[];
  expiresAt: number;
  createdAt: number;
}

export interface Message {
  id: string;
  from: string;
  content: string;
  receivedAt: number;
}

class TempNumberStore {
  private numbers: Map<string, TempNumber> = new Map();

  create(number: string, country: string = 'US', ttlMinutes: number = 60): TempNumber {
    const id = Math.random().toString(36).substring(2, 15);
    const now = Date.now();
    
    const tempNumber: TempNumber = {
      id,
      number,
      country,
      messages: [],
      createdAt: now,
      expiresAt: now + (ttlMinutes * 60 * 1000)
    };
    
    this.numbers.set(id, tempNumber);
    return tempNumber;
  }

  get(id: string): TempNumber | undefined {
    const num = this.numbers.get(id);
    if (num && num.expiresAt < Date.now()) {
      this.numbers.delete(id);
      return undefined;
    }
    return num;
  }

  getAll(): TempNumber[] {
    const now = Date.now();
    for (const [id, num] of this.numbers) {
      if (num.expiresAt < now) this.numbers.delete(id);
    }
    return Array.from(this.numbers.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  addMessage(id: string, from: string, content: string): Message | null {
    const num = this.get(id);
    if (!num) return null;
    
    const message: Message = {
      id: Math.random().toString(36).substring(2, 15),
      from,
      content,
      receivedAt: Date.now()
    };
    
    num.messages.push(message);
    return message;
  }

  delete(id: string): boolean {
    return this.numbers.delete(id);
  }

  clear(): void {
    this.numbers.clear();
  }
}

export const store = new TempNumberStore();


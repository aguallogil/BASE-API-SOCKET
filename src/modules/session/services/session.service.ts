import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../models/session.model';

@Injectable()
export class SessionService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) {}

  async createSession(userId: string, socketId: string, sessionType: 'http' | 'websocket') {
    // Finaliza cualquier sesión activa previa del mismo tipo
    await this.endSession(userId, sessionType);

    // Crea una nueva sesión con el socketId
    const newSession = new this.sessionModel({
      userId,
      socketId,
      sessionType,
      isActive: true,
      createdAt: new Date(),
    });

    return newSession.save();
  }

  async endSession(userId: string, sessionType: 'http' | 'websocket') {
    await this.sessionModel.updateMany(
      { userId, sessionType, isActive: true },
      { $set: { isActive: false } },
    );
  }

  async getActiveWebSocketSession(userId: string): Promise<Session | null> {
    return this.sessionModel.findOne({ userId, sessionType: 'websocket', isActive: true });
  }
}

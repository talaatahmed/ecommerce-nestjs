import { Injectable } from '@nestjs/common';
import { Model, ProjectionType, QueryFilter, QueryOptions } from 'mongoose';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  public async createDocument(document: Partial<T>) {
    //const created = await this.model.create(document);
    const doc = new this.model(document);
    return doc.save();
  }

  public async findDocuments(
    filters: QueryFilter<T>,
    project?: ProjectionType<T>,
    options?: QueryOptions,
  ) {
    return this.model.find(filters, project, options);
  }
  async findOneDocument(
    filters: QueryFilter<T>,
    project?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.model.findOne(filters, project, options);
  }

  public async updateDocument(
    filters: QueryFilter<T>,
    updateData: Record<string, any>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filters, updateData, {
      new: true,
      ...options,
    });
  }
}

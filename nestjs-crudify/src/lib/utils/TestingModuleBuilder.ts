import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export class TestingModuleBuilder {
  private imports: Array<any> = [];
  private providers: Array<any> = [];
  private mongoModule: any;
  private mongoFeatures: Array<any> = [];
  public mongoServer!: MongoMemoryServer;
  public module!: TestingModule;
  public app!: any;

  withImports(newImport: any) {
    this.imports.push(newImport);
    return this;
  }

  withEnviroment(environment: any) {
    return this.withImports(
      ConfigModule.forRoot({
        isGlobal: true,
        load: [environment],
      })
    );
  }

  withMongoInMemory() {
    this.mongoModule = true;
    return this;
  }

  withMongoRepository(feature: any) {
    this.mongoFeatures.push(feature);
    return this;
  }

  withProvider(provider: any) {
    this.providers.push(provider);
    return this;
  }

  public async build() {
    if (this.mongoModule) {
      this.mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(this.mongoServer.getUri());

      this.mongoModule = MongooseModule.forRoot(this.mongoServer.getUri());

      this.imports.push(this.mongoModule);
    }

    if (this.mongoFeatures.length > 0) {
      this.imports.push(MongooseModule.forFeature(this.mongoFeatures));
    }

    this.module = await Test.createTestingModule({
      imports: this.imports,
      providers: this.providers,
    }).compile();

    this.app = this.module.createNestApplication();
    this.app.enableShutdownHooks();
    this.app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await this.app.init();

    return this;
  }
}

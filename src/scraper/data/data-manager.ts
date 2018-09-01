import {
  Db,
  InsertOneWriteOpResult,
  MongoClient,
  UpdateWriteOpResult,
} from 'mongodb'
import { FundDetails } from './details'
import { CumulativeReturn } from './return'

const MONGO_CONNECTION_URL = 'mongodb://localhost:27017/fund-dashboard'

class DataManager {
  public static async build(db: string): Promise<DataManager> {
    return new DataManager(await MongoClient.connect(MONGO_CONNECTION_URL), db)
  }

  private db: Db
  private client: MongoClient

  constructor(client: MongoClient, db: string) {
    this.db = client.db(db)
    this.client = client
  }

  public close(): Promise<void> {
    return this.client.close()
  }

  public saveDetails(details: FundDetails): Promise<UpdateWriteOpResult> {
    return this.db
      .collection('details')
      .updateOne({ isin: details.isin }, { $set: details }, { upsert: true })
  }

  public saveCumulativeReturn(
    cumReturn: CumulativeReturn
  ): Promise<UpdateWriteOpResult> {
    return this.db
      .collection('returns')
      .updateOne({ id: cumReturn.id }, { $set: cumReturn }, { upsert: true })
  }
}

export { DataManager }

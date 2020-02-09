import { Request, Response } from 'express'
import IRepository from '../../common/model/repository/IRepository'
import { Sprint } from '../../common/model/Sprint'
import SprintManResponse from '../../common/model/wrapper/BunkerResponse'

export default class SprintController {

  private readonly repository: IRepository<Sprint, number>

  constructor(repository: IRepository<Sprint, number>) {
    this.repository = repository
  }

  public async fetchSprint(req: Request, res: Response): Promise<void> {
    res.json(SprintManResponse.single(await this.repository.findById(req.params.id)))
  }

  public async fetchSprints(req: Request, res: Response): Promise<void> {
    res.json(SprintManResponse.single(await this.repository.findBy(req.query)))
  }

  public async createSprint(req: Request, res: Response) {
    res.json(SprintManResponse.single(await this.repository.save(req.body)))
  }
}

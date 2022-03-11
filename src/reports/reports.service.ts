import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dtp';
import { Report } from './reports.entity';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate(estimateDto: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make=:make', { make: estimateDto.make }) //:make is some value which comes from {make:estimateDto.make}
        .andWhere('model = :model', { model: estimateDto.model })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng }) // lng - given lng from the query
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year: estimateDto.year }) //year should be within 3 years
        .orderBy('ABS(mileage - :mileage)', 'DESC') //orderby doesnot take second argument so use setParameters
        .setParameters({ mileage: estimateDto.mileage })
        .limit(3)
        //this also prevents form sql injection ..else it would look like 'make: estimateDto.make'
        // never stick raw string that is coming from incoming request directly to sql query

        .getRawOne()
    );
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user; //saving the asscociation from User

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }
}

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  email: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true , nullable: false})
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  name: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  apellido: string;

  

  

  
  
}
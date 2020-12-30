import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'prices' })
export class Price {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Index("idx-prices-token0")
  @Column({ type: 'varchar' })
  token0: string;

  // @Index("idx-prices-token1")
  @Column({ type: 'varchar' })
  token1: string;

  @Column({ type: 'float' })
  midPrice: number;

  @Column({ type: 'float' })
  invertMidPrice: number;

  @Column('int')
  timestamp: number;
}
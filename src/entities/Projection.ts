import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Hall } from "./Hall";
import { Reservation } from "./Reservation";
import type { MovieModel } from "../models/movie.model";

@Index("fk_projection_hall_idx", ["hallId"], {})
@Entity("projection", { schema: "sii_psep_2025" })
export class Projection {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "projection_id",
    unsigned: true,
  })
  projectionId: number;

  @Column("int", { name: "hall_id", unsigned: true })
  hallId: number;

  @Column("int", { name: "movie_id", unsigned: true })
  movieId: number;

  movie: null | MovieModel

  @Column("datetime", { name: "time" })
  time: Date;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Hall, (hall) => hall.projections, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "hall_id", referencedColumnName: "hallId" }])
  hall: Hall;

  @OneToMany(() => Reservation, (reservation) => reservation.projection)
  reservations: Reservation[];
}

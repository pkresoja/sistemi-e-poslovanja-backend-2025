import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cinema } from './Cinema'
import { Projection } from './Projection'


@Index("uq_hall_name", ["name",], { unique: true })
@Index("fk_hall_cinema_idx", ["cinemaId",], {})
@Entity("hall", { schema: "sii_psep_2025" })
export class Hall {

    @PrimaryGeneratedColumn({ type: "int", name: "hall_id", unsigned: true })
    hallId: number;

    @Column("int", { name: "cinema_id", unsigned: true })
    cinemaId: number;

    @Column("varchar", { name: "name", unique: true, length: 255 })
    name: string;

    @Column("int", { name: "num_of_seats", unsigned: true })
    numOfSeats: number;

    @Column("bool", { name: "dolby", default: () => "'false'", })
    dolby: boolean;

    @Column("bool", { name: "3d", default: () => "'false'", })
    has3d: boolean;

    @Column("datetime", { name: "created_at", default: () => "CURRENT_TIMESTAMP", })
    createdAt: Date;

    @Column("datetime", { name: "updated_at", nullable: true })
    updatedAt: Date | null;

    @Column("datetime", { name: "deleted_at", nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => Cinema, cinema => cinema.halls, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn([{ name: "cinema_id", referencedColumnName: "cinemaId" },
    ])

    cinema: Cinema;

    @OneToMany(() => Projection, projection => projection.hall)


    projections: Projection[];

}

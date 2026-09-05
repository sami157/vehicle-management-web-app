#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2ae32977a3a60df19242cc2a72cef745384b3c10037e0b69212372fed16bc686/contract';
import endContract from '../../snapshots/2ae32977a3a60df19242cc2a72cef745384b3c10037e0b69212372fed16bc686/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'department',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'location',
        columns: [
          col('address', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'maintenanceRecord',
        columns: [
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('createdById', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('expectedEndAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('internalNotes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('startedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('ongoing'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('vehicleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'maintenanceRecord_status_check_43929e42',
            "\"status\" IN ('ongoing', 'completed')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ride',
        columns: [
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('destinationLocationId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('primaryRiderId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startLocationId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('active'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('vehicleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'ride_status_check_af2bdd58',
            "\"status\" IN ('active', 'completed', 'needs_review')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('avatarUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('departmentId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('firebaseUid', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('user'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('user_role_check_72c6234f', "\"role\" IN ('admin', 'user', 'driver')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'vehicle',
        columns: [
          col('capacity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('homeLocationId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('operationalStatus', 'text', {
            notNull: true,
            default: lit('available'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('photoUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('registrationNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('vehicleType', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'vehicle_operationalStatus_check_77cb388a',
            "\"operationalStatus\" IN ('available', 'maintenance', 'inactive')",
          ),
          checkExpression(
            'vehicle_vehicleType_check_a8b4e344',
            "\"vehicleType\" IN ('jac', 'hiace')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'vehicleDepartmentOwner',
        columns: [
          col('departmentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('vehicleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['vehicleId', 'departmentId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'vehicleDriver',
        columns: [
          col('assignedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('driverId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('vehicleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['vehicleId', 'driverId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'vehicleUserOwner',
        columns: [
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('vehicleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['vehicleId', 'userId'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'department',
        constraint: 'department_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_firebaseUid_key',
        columns: ['firebaseUid'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'vehicle',
        constraint: 'vehicle_registrationNumber_key',
        columns: ['registrationNumber'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'department',
        index: 'department_isActive_idx_77fe3ba1',
        columns: ['isActive'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'location',
        index: 'location_isActive_sortOrder_idx_43c1fe34',
        columns: ['isActive', 'sortOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'maintenanceRecord',
        index: 'maintenanceRecord_createdById_idx_8bf640ed',
        columns: ['createdById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'maintenanceRecord',
        index: 'maintenanceRecord_expectedEndAt_idx_b540f38a',
        columns: ['expectedEndAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'maintenanceRecord',
        index: 'maintenanceRecord_vehicleId_status_idx_a4d785a6',
        columns: ['vehicleId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'maintenanceRecord',
        index: 'maintenance_active_vehicle_0c063cf3',
        columns: ['vehicleId'],
        extras: { where: "(status = 'ongoing')", unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'ride',
        index: 'ride_active_rider_f660706a',
        columns: ['primaryRiderId'],
        extras: { where: "(status = 'active')", unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'ride',
        index: 'ride_active_vehicle_cce92904',
        columns: ['vehicleId'],
        extras: { where: "(status = 'active')", unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'ride',
        index: 'ride_destinationLocationId_idx_307b052b',
        columns: ['destinationLocationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ride',
        index: 'ride_primaryRiderId_startedAt_idx_13053851',
        columns: ['primaryRiderId', 'startedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ride',
        index: 'ride_startLocationId_idx_a57ab12b',
        columns: ['startLocationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ride',
        index: 'ride_status_startedAt_idx_06109915',
        columns: ['status', 'startedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ride',
        index: 'ride_vehicleId_startedAt_idx_47280d4e',
        columns: ['vehicleId', 'startedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user',
        index: 'user_departmentId_idx_8e261ed8',
        columns: ['departmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user',
        index: 'user_role_isActive_idx_d369089a',
        columns: ['role', 'isActive'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vehicle',
        index: 'vehicle_homeLocationId_idx_e9f8f2ea',
        columns: ['homeLocationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vehicle',
        index: 'vehicle_operationalStatus_idx_5fecacdf',
        columns: ['operationalStatus'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vehicle',
        index: 'vehicle_vehicleType_idx_2294d164',
        columns: ['vehicleType'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vehicleDepartmentOwner',
        index: 'vehicleDepartmentOwner_departmentId_idx_8e261ed8',
        columns: ['departmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vehicleDepartmentOwner',
        index: 'vehicleDepartmentOwner_vehicleId_idx_e2df58fc',
        columns: ['vehicleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vehicleDriver',
        index: 'vehicleDriver_driverId_idx_8eed3317',
        columns: ['driverId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vehicleDriver',
        index: 'vehicleDriver_vehicleId_idx_e2df58fc',
        columns: ['vehicleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vehicleUserOwner',
        index: 'vehicleUserOwner_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vehicleUserOwner',
        index: 'vehicleUserOwner_vehicleId_idx_e2df58fc',
        columns: ['vehicleId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'maintenanceRecord',
        foreignKey: {
          name: 'maintenanceRecord_vehicleId_fkey',
          columns: ['vehicleId'],
          references: { schema: 'public', table: 'vehicle', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'maintenanceRecord',
        foreignKey: {
          name: 'maintenanceRecord_createdById_fkey',
          columns: ['createdById'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ride',
        foreignKey: {
          name: 'ride_vehicleId_fkey',
          columns: ['vehicleId'],
          references: { schema: 'public', table: 'vehicle', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ride',
        foreignKey: {
          name: 'ride_primaryRiderId_fkey',
          columns: ['primaryRiderId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ride',
        foreignKey: {
          name: 'ride_startLocationId_fkey',
          columns: ['startLocationId'],
          references: { schema: 'public', table: 'location', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ride',
        foreignKey: {
          name: 'ride_destinationLocationId_fkey',
          columns: ['destinationLocationId'],
          references: { schema: 'public', table: 'location', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'user',
        foreignKey: {
          name: 'user_departmentId_fkey',
          columns: ['departmentId'],
          references: { schema: 'public', table: 'department', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'vehicle',
        foreignKey: {
          name: 'vehicle_homeLocationId_fkey',
          columns: ['homeLocationId'],
          references: { schema: 'public', table: 'location', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'vehicleDepartmentOwner',
        foreignKey: {
          name: 'vehicleDepartmentOwner_vehicleId_fkey',
          columns: ['vehicleId'],
          references: { schema: 'public', table: 'vehicle', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'vehicleDepartmentOwner',
        foreignKey: {
          name: 'vehicleDepartmentOwner_departmentId_fkey',
          columns: ['departmentId'],
          references: { schema: 'public', table: 'department', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'vehicleDriver',
        foreignKey: {
          name: 'vehicleDriver_vehicleId_fkey',
          columns: ['vehicleId'],
          references: { schema: 'public', table: 'vehicle', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'vehicleDriver',
        foreignKey: {
          name: 'vehicleDriver_driverId_fkey',
          columns: ['driverId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'vehicleUserOwner',
        foreignKey: {
          name: 'vehicleUserOwner_vehicleId_fkey',
          columns: ['vehicleId'],
          references: { schema: 'public', table: 'vehicle', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'vehicleUserOwner',
        foreignKey: {
          name: 'vehicleUserOwner_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);

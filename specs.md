# Vehicle Management App — Product and UI Plan

> Working product notes for an internal organization vehicle-management app.

## 1. Product intent

The organization owns a fleet of vehicles that employees can use for work-related travel. The app should make it immediately clear:

- Which vehicles are available right now
- Which vehicles are currently engaged in a ride
- Which vehicles are unavailable because of maintenance
- Who is using a vehicle and when the ride started
- Where a ride begins and ends, using approved organization locations

The first version should optimize for a fast, reliable ride check-in/check-out flow. Scheduling, vehicle sharing, reporting, and other fleet tools can build on the same ride and vehicle records later.

## 2. Product assumptions

- The app is for employees within one organization.
- Employees authenticate with their organization account.
- Vehicles are selected from the organization fleet; employees do not add arbitrary vehicles.
- Start and destination are selected from a managed list of locations. There is no free-form map picker in the initial product.
- A vehicle can have only one active ride at a time.
- A vehicle marked as under maintenance cannot be started or scheduled.
- A user can have only one active ride at a time in the MVP.
- Vehicle use is limited to work-related travel; no business-purpose field is required.
- Rides do not require fleet-administrator approval.
- Employees can see the current rider's name and ride start time for engaged vehicles.
- Forgotten rides remain active until manually completed or resolved by the rider or a fleet administrator. Automatic release and threshold logic are deferred.
- The planned destination is treated as the ride's end location. Odometer, fuel, and charging details are not required initially.
- Vehicle sharing supports passengers only. The primary rider remains responsible for starting and completing the ride.
- Vehicles may have an optional home location for filtering and reporting, but it does not restrict usage.
- Ride, maintenance, schedule, and unresolved-ride notifications support both in-app and organization email delivery.
- A fleet administrator maintains vehicles, locations, and maintenance status.

## 3. Roles and permissions

### Employee

- View vehicle availability and maintenance status
- Start an available ride
- Select an approved start location and destination
- View their active ride and ride history
- Complete their active ride
- Report a problem or incident with a vehicle
- View scheduled rides when scheduling is enabled

### Fleet administrator

- All employee capabilities
- Add, edit, deactivate, and inspect vehicles
- Change a vehicle's operational status
- Create and update maintenance records
- View all active, completed, and scheduled rides
- Manage the approved location list
- Resolve incorrect or abandoned ride records
- Review basic fleet usage information
- Manage employees, roles, and organization settings
- Configure policies such as required ride details and cancellation rules
- Access audit logs and reports

## 4. Core concepts and statuses

### Vehicle status

The vehicle list should expose one clear status badge per vehicle:

| Status | Meaning | Can a new ride start? |
| --- | --- | --- |
| Available | Ready for an employee to use | Yes |
| Engaged | Currently being used in an active ride | No |
| Maintenance | Temporarily unavailable for service or repair | No |
| Inactive | Removed from normal fleet operations | No |

`Engaged` is derived from the presence of an active ride. A vehicle's manually managed operational status should not be overwritten when a ride completes. For example, a vehicle can return from an active ride and then remain in `Maintenance` if a maintenance record was created during the ride.

### Ride status

- `Scheduled` — reserved for a future time; planned feature
- `Active` — the employee has started the ride
- `Completed` — the employee has ended the ride
- `Cancelled` — a scheduled ride was cancelled; planned feature
- `Needs review` — an exceptional record requiring fleet-administrator action

The most important state transition is:

```text
Available vehicle -> Start ride -> Engaged vehicle -> Complete ride -> Available vehicle
                                      |
                                      +-> Maintenance, if the vehicle is flagged during the ride
```

## 5. MVP feature set

### Authentication and account

- Organization sign-in
- User profile with name, department, role, and contact information
- Sign out
- Access controlled by role

### Employee dashboard

The dashboard is the primary home screen and should answer “Can I use a vehicle now?” without requiring extra navigation.

- Summary cards: available, engaged, and maintenance vehicles
- Prominent `Start a ride` action
- Active ride panel when the user has an active ride
- Recent rides
- Notices for maintenance, policy updates, or unresolved issues

### Vehicle directory

- Search and filter by status, vehicle type, and optionally location/depot
- Vehicle cards or rows showing:
  - Vehicle name or model
  - Registration/fleet number
  - Status
  - Current user and ride start time when engaged
  - Maintenance note or expected return date when unavailable
- Vehicle detail view with specifications, status history, and recent usage

### Start a ride

The flow should be short and form-based:

1. Choose an available vehicle.
2. Choose a start location from the approved location list.
3. Choose a destination from the approved location list.
4. Optionally enter notes if enabled by policy.
5. Review the details.
6. Confirm `Start ride`.

After confirmation, show the active ride immediately and update the vehicle to `Engaged` for all users.

### Active ride

The active-ride screen should be the clearest screen in the app:

- Vehicle identity and status
- Rider name
- Start time and elapsed duration
- Start location and destination
- Optional notes
- Primary `Complete ride` button
- Secondary `Report a problem` action

The user should be able to reach this screen from the dashboard, navigation, and a persistent active-ride indicator.

### Complete a ride

- Show the ride summary before completion
- Require confirmation to prevent accidental completion
- Treat the planned destination as the ride's end location
- Do not collect odometer, fuel, or charging details during completion
- Keep damage and incident reporting as a separate action
- On success, show completion time and return the vehicle to its eligible operational status
- Refresh vehicle availability immediately

### My rides

- Tabs or filters for active, completed, and scheduled rides
- Table/list with vehicle, route, date, duration, and status
- Ride detail view with the full audit timeline
- Empty states that explain what the user can do next

### Maintenance visibility

Employees should see that a vehicle is under maintenance, but sensitive internal notes can be restricted to fleet administrators.

- Maintenance badge and short availability message on vehicle cards
- Expected return date when known
- Vehicle detail maintenance section
- Fleet-administrator workflow to start, update, and close maintenance records

## 6. Future feature set

These should be added after the basic start/complete flow is stable.

### Ride scheduling

- Select a vehicle or request any suitable vehicle
- Choose a future date/time and approved locations
- View conflicts before submitting
- No fleet-administrator approval is required
- Edit, cancel, or reassign a scheduled ride
- Calendar/list views for personal and fleet-wide schedules
- Reminders before departure

### Vehicle sharing and passengers

Define sharing as a ride with one primary rider and one or more employee passengers rather than allowing multiple unrelated active rides for one vehicle.

- Invite employees as passengers or co-riders
- Allow a scheduled ride owner to manage participants
- Show all participants on the active ride
- Keep the primary rider responsible for starting and completing the ride
- Do not support driver handoffs or transferring ride responsibility
- Preserve a participant history for reporting and safety

### Fleet operations

- Maintenance schedules and service reminders
- Vehicle documents, insurance, inspection, and expiry tracking
- Fuel/charging logs and mileage/odometer tracking
- Incident and damage reports with attachments
- Vehicle assignment to departments or locations
- Audit log for status and ride changes

### Reporting and notifications

- Utilization by vehicle, department, and time period
- Most-used routes and locations
- Maintenance downtime
- Upcoming scheduled rides
- Overdue active rides and unresolved incidents
- In-app and organization email notifications for ride, maintenance, schedule, and unresolved-ride events

## 7. UI information architecture

### Employee navigation

```text
Dashboard
Vehicles
My rides
Schedule          (when enabled)
Profile
```

Use a left sidebar on desktop and a compact bottom navigation or menu on small screens. Keep `Start a ride` as a persistent primary action on the dashboard and vehicle pages.

### Fleet-administrator navigation

```text
Overview
Vehicles
All rides
Maintenance
Locations
Users
Reports
Settings
```

### Suggested routes

| Route | Purpose |
| --- | --- |
| `/` | Dashboard |
| `/vehicles` | Fleet directory |
| `/vehicles/:vehicleId` | Vehicle detail |
| `/rides/start` | Start-ride form |
| `/rides/active` | Current user's active ride |
| `/rides` | Current user's ride history |
| `/rides/:rideId` | Ride detail |
| `/schedule` | Scheduled rides, later feature |
| `/admin/overview` | Fleet overview |
| `/admin/vehicles` | Vehicle management |
| `/admin/maintenance` | Maintenance management |
| `/admin/locations` | Approved location management |
| `/admin/users` | User and role management |
| `/admin/reports` | Fleet reporting |

## 8. Screen structure

### Dashboard

```text
Top bar: organization name | notifications | profile
Page heading: Good morning, [name]
Primary action: [Start a ride]
Summary: Available | Engaged | Maintenance
Active ride card or “No active ride” state
Available vehicles preview
Recent rides
```

### Vehicle list

```text
Page heading: Vehicles
Search | status filter | vehicle type filter
Vehicle card/list:
  identity | status | availability detail | action
```

Only available vehicles should expose `Start ride` as the default action. Engaged and maintenance vehicles should explain why they cannot be selected.

### Start-ride page

Use a single-page form on desktop and a stepper on mobile if the form becomes long.

```text
1. Vehicle selection
2. Trip details: start location, destination, optional notes
3. Review
4. Confirmation
```

Use searchable select controls for locations. The location list must be loaded from the organization-managed list and must not expose a map or arbitrary coordinate entry.

### Active-ride page

```text
Status: Ride active / Vehicle engaged
Vehicle: [name, fleet number]
Route: [approved start] -> [approved destination]
Started: [time] | Duration: [elapsed time]
[Complete ride]
[Report a problem]
```

### Fleet-administrator overview

- Fleet status distribution
- Active rides with rider and start time
- Vehicles needing attention
- Upcoming maintenance
- Recent activity and unresolved records

## 9. Reusable UI components

- `StatusBadge` for vehicle and ride states
- `VehicleCard` and `VehicleTable`
- `AvailabilitySummary`
- `LocationSelect`
- `RideSummaryCard`
- `ActiveRideBanner`
- `ConfirmActionDialog`
- `EmptyState`
- `ErrorState` with retry action
- `MaintenanceNotice`
- `AuditTimeline`
- `FilterBar`
- `PermissionGate` for role-specific actions

Keep status colors accessible and do not rely on color alone:

- Available: positive/green treatment plus text
- Engaged: neutral/blue treatment plus text
- Maintenance: warning/orange treatment plus text
- Inactive: muted/gray treatment plus text
- Needs review: danger/red treatment plus text

## 10. Suggested data model

### User

`id`, `name`, `email`, `department`, `role`, `avatarUrl`, `isActive`, timestamps

### Vehicle

`id`, `name`, `make`, `model`, `registrationNumber`, `vehicleType`, `operationalStatus`, `homeLocationId`, `notes`, timestamps

`operationalStatus` should represent the manually managed status (`available`, `maintenance`, or `inactive`). The UI can derive `engaged` when an active ride exists.

### Location

`id`, `name`, `code`, `description`, `address`, `isActive`, `sortOrder`, timestamps

Locations should be organization-managed and soft-deletable so old rides retain valid historical labels.

### Ride

`id`, `vehicleId`, `primaryRiderId`, `startLocationId`, `destinationLocationId`, `notes`, `status`, `startedAt`, `completedAt`, timestamps

Future fields may include `scheduledStartAt`, `scheduledEndAt`, and `incidentId`. Approval, odometer, fuel, and charging fields are not part of the finalized initial ride workflow.

### Maintenance record

`id`, `vehicleId`, `status`, `reason`, `startedAt`, `expectedEndAt`, `completedAt`, `internalNotes`, `createdById`, timestamps

### Future sharing records

Use a separate `RideParticipant` record with `rideId`, `userId`, `role: passenger`, and timestamps. This keeps the primary rider distinct from passengers and does not support driver handoffs.

## 11. Important business rules

- Starting a ride must be atomic: two employees must not be able to claim the same vehicle at the same time.
- The server, not only the UI, must validate that the vehicle is available and the user has no active ride.
- A ride cannot start without a valid active vehicle, start location, and destination.
- No ride or schedule requires fleet-administrator approval.
- Start and destination must reference active organization locations.
- A vehicle in maintenance or inactive status cannot be started.
- Completing a ride must be restricted to the primary rider or an authorized fleet administrator.
- The planned destination is the ride's end location; completion does not require odometer, fuel, or charging data.
- A vehicle's optional home location is used for filtering and reporting only and must not block usage elsewhere.
- Forgotten rides remain active until manually completed or resolved; automatic release is deferred.
- A vehicle becomes engaged only after a ride is successfully created as active.
- Completing a ride removes the engagement lock and reveals the vehicle's operational status.
- Maintenance status takes precedence over normal availability in user-facing screens.
- All status-changing actions should record actor and timestamp for auditability.
- Times should be stored consistently and displayed in the organization's configured timezone.
- If a user loses connection during submission, retrying must not create duplicate active rides.
- Deactivated vehicles and locations should remain visible in historical ride details but not in new forms.

## 12. MVP acceptance criteria

- An authenticated employee can see the current fleet status.
- An employee can start a ride only with an available vehicle and valid approved locations.
- Starting a ride immediately marks the vehicle as engaged for other users.
- The active rider can see the vehicle, route, start time, and elapsed duration.
- The active rider can complete the ride and see a completion confirmation.
- Completing a ride makes the vehicle available again unless its operational status is maintenance or inactive.
- Employees can view their own ride history.
- Employees can start work rides without entering a business purpose or receiving approval.
- Engaged vehicle cards show the current rider and ride start time.
- Fleet administrators can manage vehicles, maintenance status, and approved locations.
- The primary rider remains responsible for completion, while passengers cannot take over the ride.
- Ride completion requires no end-location, odometer, fuel, or charging details.
- Ride, maintenance, schedule, and unresolved-ride events support in-app and organization email notifications.
- No automated forgotten-ride release or threshold logic is present in the initial implementation.
- Unauthorized users cannot access fleet-administrator actions or another employee's private ride details.
- The UI provides clear loading, empty, validation, permission, conflict, and server-error states.

## 13. Recommended delivery order

1. Define authentication, roles, and organization context.
2. Build vehicle, location, ride, and maintenance data models.
3. Implement the atomic start-ride and complete-ride APIs.
4. Build the employee dashboard, vehicle directory, start flow, active ride, and ride history.
5. Add fleet-administrator vehicle, location, and maintenance screens.
6. Add validation, conflict handling, audit logging, and responsive polish.
7. Add scheduling, then participant-based vehicle sharing.
8. Add incidents, operational records, notifications, and reporting.

## 14. Finalized product decisions

- Vehicle use is work-only; no business-purpose field is required.
- No fleet-administrator approval is required for rides, including future scheduled rides.
- Employees can see the current rider's name and ride start time.
- Forgotten rides are manually resolved by the rider or fleet administrator. Automatic vehicle release and threshold logic are deferred.
- The planned destination is treated as the ride's end location. No odometer, fuel, or charging details are required initially.
- Vehicle sharing means passengers only. One primary rider starts and completes the ride; driver handoffs are not supported.
- Vehicles may have an optional home location for filtering and reporting, but location assignment does not restrict usage.
- Notifications support both in-app and organization email delivery.

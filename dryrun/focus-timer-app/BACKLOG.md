# BACKLOG: Focus Timer App

**Date:** 2026-02-19

## Epics
1. **Core Timer System:** Ensure the 25/5 minute cycles work flawlessly.
2. **Task Management:** Allow users to manage what they are focusing on.

## Issues / User Stories

### Focus Timer
- **#1 [Feature] Create Pomodoro Timer**
  - **DoD:** Timer counts down from 25:00. Shows remaining time on screen. Plays a sound when finished.
- **#2 [Feature] Create Break Timer**
  - **DoD:** After 25 minutes, automatically switch or prompt to switch to a 5-minute break timer.

### Task List
- **#3 [Feature] Add/Remove/Edit Tasks**
  - **DoD:** UI has an input field. Pressing Enter adds to a list below. Can delete tasks.
- **#4 [Feature] Link Timer to Task**
  - **DoD:** User can select an active task. When a Pomodoro completes, a checkmark or session counter is incremented next to the task.

### Data Persistence
- **#5 [Feature] Save State to LocalStorage**
  - **DoD:** Reloading the page retains task list and session counts.

## Priorities (MoSCoW)
- **Must Have:** #1, #2, #3
- **Should Have:** #4, #5
- **Could Have:** Settings to change timer duration
- **Won't Have:** Cloud Sync

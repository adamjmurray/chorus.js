TODO:
- Add basic rhythm (drum, or bass?) sequencer to Song
  - using time-delta scheduler logic so we can do rhythms like [3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 1, 3, 2],
  - Stop relying on the MIDIOut's defaultDuration and actually sequence it. Maybe do something smart with inter-note-onsets by default?
  - Support intensity/groove
  - Time patterns vs triggers? Maybe this can be handled by nested patterns or a specialized pattern class.
- Introduce idea of sections to Song, for different chord progressions?
- Automatic voice leading, esp for chord progressions, maybe for bass/lead too (prefer intervals less than a tritone)?

Euclidean Sequencer / Pattern

Defer working on the custom syntax until the core system can product a whole song. Maybe that should be a separate project.


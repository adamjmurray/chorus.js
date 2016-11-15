## chorus.js Overview

The {@link Song} class is used to generate a song. The overall structure looks like this:
 
<table style="color:#111; font-family:sans-serif; border:3px solid sienna; border-radius:12px; background-color:#EEB; border-collapse:separate; border-spacing:5px; box-shadow: 4px 6px 12px rgba(0,0,0,0.5);">
  <tr>
    <td style="border:0; font-size:xx-large; font-weight:bold;">Song</td>
    <td style="border:0; font-size:large; text-align:center;">&rarr;&nbsp;<em>time</em>&nbsp;&rarr;</td>
  </tr>
  <tr style="white-space:nowrap;">
    <td style="border:3px solid darkred; border-radius:8px; background-color:#eeb9a0; padding:10px; vertical-align:text-top;">
      <table style="width:100%; border-collapse:separate;">
        <tr>
          <td style="border:0; font-size:x-large; text-align:left;">Section&nbsp;1</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">scale</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkgreen; border-radius:6px; background-color:#BEB; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Harmony</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">chords</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkblue; border-radius:6px; background-color:lightblue; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Part&nbsp;1&nbsp;</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">pitches</span></td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">rhythm</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkblue; border-radius:6px; background-color:lightblue; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Part&nbsp;2&nbsp;</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">pitches</span></td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">rhythm</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkblue; border-radius:6px; background-color:lightblue; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Part&nbsp;3&nbsp;</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">pitches</span></td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">rhythm</span></td>
        </tr>
      </table>
      <table style="width:100%; font-size:xx-large;">
        <tr><td style="border:0; text-align:center; font-weight:bold;">&vellip;</td></tr>
      </table>
    </td>
    <td style="border:3px solid darkred; border-radius:8px; background-color:#eeb9a0; padding:10px; vertical-align:text-top;">
      <table style="width:100%; border-collapse:separate;">
        <tr>
          <td style="border:0; font-size:x-large; text-align:left;">Section&nbsp;2</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">scale</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkgreen; border-radius:6px; background-color:#BEB; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Harmony</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">chords</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkblue; border-radius:6px; background-color:lightblue; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Part&nbsp;1&nbsp;</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">pitches</span></td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">rhythm</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkblue; border-radius:6px; background-color:lightblue; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Part&nbsp;2&nbsp;</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">pitches</span></td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">rhythm</span></td>
        </tr>
      </table>
      <table style="width:100%; font-size:xx-large;">
        <tr><td style="border:0; text-align:center; font-weight:bold;">&vellip;</td></tr>
      </table>
    </td>
    <td style="border:3px solid darkred; border-radius:8px; background-color:#eeb9a0; padding:10px; vertical-align:text-top;">
      <table style="width:100%; border-collapse:separate;">
        <tr>
          <td style="border:0; font-size:x-large; text-align:left;">Section&nbsp;3</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">scale</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkgreen; border-radius:6px; background-color:#BEB; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Harmony</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">chords</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkblue; border-radius:6px; background-color:lightblue; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Part&nbsp;1&nbsp;</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">pitches</span></td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">rhythm</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkblue; border-radius:6px; background-color:lightblue; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Part&nbsp;2&nbsp;</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">pitches</span></td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">rhythm</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkblue; border-radius:6px; background-color:lightblue; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Part&nbsp;3&nbsp;</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">pitches</span></td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">rhythm</span></td>
        </tr>
      </table>
      <table style="border:2px solid darkblue; border-radius:6px; background-color:lightblue; width:100%; border-collapse:separate; border-spacing:5px; margin-top:10px;">
        <tr>
          <td style="border:0;">Part&nbsp;4&nbsp;</td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">pitches</span></td>
          <td style="border:0;"><span style="font-size:small; background-color:white; padding:4px; border-radius:4px;">rhythm</span></td>
        </tr>
      </table>
      <table style="width:100%; font-size:xx-large;">
        <tr><td style="border:0; text-align:center; font-weight:bold;">&vellip;</td></tr>
      </table>
    </td>
    <td style="border:0; font-size:xx-large; vertical-align:middle;">&hellip;</td>
  </tr>
</table>
<br/>

A {@link Song} consists of a list of `sections` that play one after the other sequentially in time. 

Each `Section` has a `scale`, a `harmony`, and a list of `parts` which play in parallel within the `Section`
(note that any Part may start late or end early within its `Section`). 

A `Harmony` has a list of `chords` that define a chord progression.

Each `Part` has a list of `pitches`, and a `rhythm` that controls the timing, intensity, and duration of each note generated by the `part`.

A `Part`'s `pitches` can either be absolute `Pitch`es, or `Number`s that represent <em>relative pitch values</em>.
Relative pitch values produce `Pitch`es based on the `Part`'s mode setting, the `Harmony`'s `chords`, and the `Section`'s `scale`,
which makes it easy to try different scales and chord progressions without changing the `Part`.

This is the basic `Song` structure. Each object mentioned here has various options to further control the song's behavior.
Consult each class's documentation for more information.

TODO: examples!

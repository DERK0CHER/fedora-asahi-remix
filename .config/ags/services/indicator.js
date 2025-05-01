// ~/.config/ags/services/indicator.js

import Service   from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import {
  Box,
  Button,
  Icon,
  Label,
} from 'resource:///com/github/Aylur/ags/widget.js';

// Helpers to pick the correct symbolic icon names
function getPlayIconName(mpris) {
  return (mpris && mpris.playBackStatus === 'Playing')
    ? 'media-playback-pause-symbolic'
    : 'media-playback-start-symbolic';
}

function getVolumeIconName(volume, isMuted) {
  if (isMuted)                       return 'audio-volume-muted-symbolic';
  if (volume <= 0.33)                return 'audio-volume-low-symbolic';
  if (volume <= 0.66)                return 'audio-volume-medium-symbolic';
                                     return 'audio-volume-high-symbolic';
}

// Service to emit popup events
class IndicatorService extends Service {
  static {
    Service.register(this, { 'popup': ['double'] });
  }

  _delay = 1500;
  _count = 0;

  popup(value) {
    this.emit('popup', value);
    this._count++;
    Utils.timeout(this._delay, () => {
      this._count--;
      if (this._count === 0)
        this.emit('popup', -1);
    });
  }

  connectWidget(widget, callback) {
    Utils.connect(this, widget, callback, 'popup');
  }
}

// Factory for notification-action buttons
function createNotifActions(notifObject, destroyWithAnims, setupCursorHover, getString) {
  return Box({
    className: 'notif-actions spacing-h-5 transparent-bg',
    children: [
      Button({
        hexpand: true,
        className: `notif-action notif-action-${notifObject.urgency} transparent-bg`,
        onClicked: () => destroyWithAnims(),
        setup: setupCursorHover,
        child: Box({
          hpack: 'center',
          children: [
            Icon({
              icon: 'window-close-symbolic',
              className: 'txt-norm',
            }),
            Label({ label: getString('Close') }),
          ],
        }),
      }),
      ...notifObject.actions.map(action => Button({
        hexpand: true,
        className: `notif-action notif-action-${notifObject.urgency} transparent-bg`,
        onClicked: () => notifObject.invoke(action.id),
        setup: setupCursorHover,
        child: Label({ label: action.label }),
      })),
    ],
  });
}

// Singleton instance & CLI shortcut
const service = new IndicatorService();
globalThis.indicator = service;

// Public exports
export default service;
export {
  getPlayIconName,
  getVolumeIconName,
  createNotifActions,
};

import React from 'react';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { deepAssign, mergeConfigs, filterObject, deepSetIfUndefined } from '../../../utils/formConfigUtils';
import PlayerId, { formConfig as playerIdFormConfig } from './playerId';
import { renderTextField, renderRadioGroup } from '../../../utils/uiMaterialUtils';
import { RadioButton } from 'material-ui/RadioButton';

const VIDEO_TYPES = {
  VIDEO: 'video',
  PLAYLIST: 'playlist',
  SEARCH: 'search'
};

const VideoDetails = (props) => {
  const {
    type
  } = props.videoDetails || {};

  return (
    <div>
      <div>
        <Field
          name="videoDetails.type"
          component={ renderRadioGroup }
        >
          <RadioButton
            value={ VIDEO_TYPES.VIDEO }
            label="I want to play a video"
          />
          <RadioButton
            className="u-gapTop"
            value={ VIDEO_TYPES.PLAYLIST }
            label="I want to play a playlist"
          />
          <RadioButton
            className="u-gapTop u-gapBottom"
            value={ VIDEO_TYPES.SEARCH }
            label="I want to play the search results for a specified query"
          />
        </Field>

        {
          type === VIDEO_TYPES.VIDEO ? (
            <div>
              <Field
                label="Video ID"
                name="videoDetails.videoId"
                component={ renderTextField }
                supportDataElement
              />
            </div>
          ) : null
        }

        {
          type === VIDEO_TYPES.PLAYLIST ? (
            <div>
              <Field
                label="Playlist ID"
                name="videoDetails.playlistId"
                component={ renderTextField }
                supportDataElement
              />
            </div>
          ) : null
        }

        {
          type === VIDEO_TYPES.SEARCH ? (
            <div>
              <Field
                label="Search query"
                name="videoDetails.query"
                component={ renderTextField }
                supportDataElement
              />
            </div>
          ) : null
        }
      </div>

      <label>
        <span className="Label u-gapRight">
          Append the player to the element matching the CSS selector
        </span>
        <Field
          label="CSS selector"
          name="videoDetails.elementSelector"
          component={ renderTextField }
        />
      </label>

      <PlayerId />
    </div>
  );
};

export default connect(state => ({
  videoDetails: {
    type: formValueSelector('default')(state, 'videoDetails.type')
  }
}))(VideoDetails);

const fields = [
  'videoDetails.type',
  'videoDetails.videoId',
  'videoDetails.playlistId',
  'videoDetails.query',
  'videoDetails.elementSelector'
];

export const formConfig = mergeConfigs(
  playerIdFormConfig,
  {
    settingsToFormValues(values, settings) {
      values = deepAssign({}, values, filterObject(settings, fields));
      deepSetIfUndefined(values, 'videoDetails.type', VIDEO_TYPES.VIDEO);
      return values;
    },
    formValuesToSettings(settings, values) {
      settings = deepAssign({}, settings, filterObject(values, fields));

      const type = values.videoDetails.type;

      if (type === VIDEO_TYPES.VIDEO) {
        delete settings.videoDetails.playlistId;
        delete settings.videoDetails.query;
      } else if (type === VIDEO_TYPES.PLAYLIST) {
        delete settings.videoDetails.videoId;
        delete settings.videoDetails.query;
      } else {
        delete settings.videoDetails.videoId;
        delete settings.videoDetails.playlistId;
      }

      return settings;
    },
    validate(errors, values) {
      const {
        type,
        videoId,
        playlistId,
        query,
        elementSelector
      } = values.videoDetails || {};

      const videoDetailsErrors = {};

      const componentsWithErrors = errors.componentsWithErrors ?
        errors.componentsWithErrors.slice() : [];

      if (type === VIDEO_TYPES.VIDEO) {
        if (!videoId) {
          videoDetailsErrors.videoId = 'Please specify a video id';
        }
      } else if (type === VIDEO_TYPES.PLAYLIST) {
        if (!playlistId) {
          videoDetailsErrors.playlistId = 'Please specify a playlist id';
        }
      } else if (!query) {
        videoDetailsErrors.query = 'Please specify a query';
      }

      if (!elementSelector) {
        videoDetailsErrors.elementSelector = 'Please specify a CSS query selector';
      }

      if (Object.keys(videoDetailsErrors).length) {
        componentsWithErrors.push('videoDetailsExpanded');

        errors = {
          ...errors,
          videoDetails: videoDetailsErrors
        };
      }

      return {
        ...errors,
        componentsWithErrors
      };
    }
  }
);

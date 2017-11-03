import React from 'react';
import { mergeConfigs } from '../../utils/formConfigUtils';
import VideoDetails, { formConfig as videoDetailsFormConfig } from './components/videoDetails';
import PlayerDimensions, { formConfig as playerDimensionsFormConfig } from './components/playerDimensions';
import PlayerParameters, { formConfig as playerParametersFormConfig } from './components/playerParameters';
import VideoTimings, { formConfig as videoTimingsFormConfig } from './components/videoTimings';
import eventBus from '../../utils/eventBus';
import {Card, CardHeader, CardText} from 'material-ui/Card';


export default class AddPlayer extends React.Component {
  constructor() {
    super();

    this.state = {
      videoDetailsExpanded: true
    };
  }

  componentDidMount() {
    eventBus.on('validationOccurred', this.validationOccurred, this);
  }

  componentWillUnmount() {
    eventBus.off('validationOccurred', this.validationOccurred);
  }

  onAccordionChange(panel) {
    return (expanded) => {
      this.setState({[panel]: expanded});
    }
  }

  validationOccurred() {
    const { componentsWithErrors } = this.props;
    let state = this.state;

    componentsWithErrors.forEach((item) => {
      state[item] = true;
    });

    this.setState(state);
  }

  render() {
    return (
      <div>
        <Card expanded={this.state.videoDetailsExpanded} onExpandChange={ this.onAccordionChange('videoDetailsExpanded') }>
          <CardHeader
            title="Video details"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <VideoDetails />
          </CardText>
        </Card>

        <Card expanded={this.state.playerDimensions} onExpandChange={ this.onAccordionChange('playerDimensions') }>
          <CardHeader
            title="Player Dimensions"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <PlayerDimensions />
          </CardText>
        </Card>

        <Card expanded={this.state.playerParameters} onExpandChange={ this.onAccordionChange('playerParameters') }>
          <CardHeader
            title="Player Parameters"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <PlayerParameters />
          </CardText>
        </Card>

        <Card expanded={this.state.videoTimings} onExpandChange={ this.onAccordionChange('videoTimings') }>
          <CardHeader
            title="Video Timings"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <VideoTimings />
          </CardText>
        </Card>
      </div>
    );
  }
}

export const formConfig = mergeConfigs(
  videoDetailsFormConfig,
  playerDimensionsFormConfig,
  playerParametersFormConfig,
  videoTimingsFormConfig
);


import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { pagerService } from '@jenkins-cd/blueocean-core-js';
import ArtifactService from './artifacts/ArtifactService';
import ArtifactsTable from './artifacts/ArtifactsTable';

/**
 * Displays a list of artifacts from the supplied build run property.
 */
@observer
export default class RunDetailsArtifacts extends Component {

    propTypes = {
        result: PropTypes.object,
        pipeline: PropTypes.object,
        t: PropTypes.func,
    };

    componentWillMount() {
        this._initPager(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._initPager(nextProps);
    }

    _initPager(props) {
        const run = props.result;
        const pipeline = props.pipeline;
        if (!run || !pipeline) {
            return;
        }
        const artifactService = new ArtifactService(pagerService);
        this.pager = artifactService.newArtifactsPager(pipeline, run);
    }

    render() {
        return (<ArtifactsTable pipeline={this.props.pipeline} result={this.props.result} t={this.props.t} pager={this.pager} />);
    }
}

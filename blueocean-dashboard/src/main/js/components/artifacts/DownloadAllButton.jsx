import React, { Component, PropTypes } from 'react';
import { UrlConfig } from '@jenkins-cd/blueocean-core-js';

export default class DownloadAllButton extends Component {
    propTypes = {
        zipFile: PropTypes.string,
        t: PropTypes.func,
    };

    render() {
        const { zipFile, t } = this.props;
        if (!zipFile) {
            return null;
        }
        const title = t('rundetail.artifacts.button.downloadAll.title', { defaultValue: 'Download all artifact as zip' });
        const href = `${UrlConfig.getJenkinsRootURL()}${zipFile}`;
        return (<div className="downloadAllArtifactsButton">
            <a className="btn-secondary" target="_blank" title={title} href={href}>
                {t('rundetail.artifacts.button.downloadAll.text', { defaultValue: 'Download All' })}
            </a>
        </div>);
    }
}

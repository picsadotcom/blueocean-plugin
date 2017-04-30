import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { UrlConfig, ShowMoreButton } from '@jenkins-cd/blueocean-core-js';
import { FileSize, Table } from '@jenkins-cd/design-language';
import { Icon } from '@jenkins-cd/react-material-icons';

import DownloadAllButton from './DownloadAllButton';

@observer
export default class ArtifactsTable extends Component {

    propTypes = {
        pager: PropTypes.object,
        result: PropTypes.object,
        pipeline: PropTypes.object,
        t: PropTypes.func,
    };

    render() {
        const { result, t, pager } = this.props;

        if (!result) {
            return null;
        }
        const { artifactsZipFile: zipFile } = result;

        const headers = [
            { label: t('rundetail.artifacts.header.name', { defaultValue: 'Name' }), className: 'name' },
            { label: t('rundetail.artifacts.header.size', { defaultValue: 'Size' }), className: 'size' },
            { label: '', className: 'actions' },
        ];

        const style = { fill: '#4a4a4a' };

        const artifactsRendered = pager.data.map(artifact => {
            const urlArray = artifact.url.split('/');
            const fileName = urlArray[urlArray.length - 1];
            return (
                <tr key={artifact.url}>
                    <td>
                        <a target="_blank" title={t('rundetail.artifacts.button.open')} href={`${UrlConfig.getJenkinsRootURL()}${artifact.url}`}>
                            {artifact.path}
                        </a>
                    </td>
                    <td>
                        <FileSize bytes={artifact.size} />
                    </td>
                    <td className="download">
                        <a target="_blank" download={fileName} title={t('rundetail.artifacts.button.download')} href={`${UrlConfig.getJenkinsRootURL()}${artifact.url}`}>
                            <Icon style={style} icon="file_download" />
                        </a>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <DownloadAllButton zipFile={zipFile} t={t} />
                <Table headers={headers} className="artifacts-table">
                    <tr>
                        <td>
                            <a target="_blank"
                               title={t('rundetail.artifacts.button.open')}
                               href={`${UrlConfig.getJenkinsRootURL()}${result._links.self.href}log/?start=0`}
                            >
                                pipeline.log
                            </a>
                        </td>
                        <td>-</td>
                        <td className="download">
                            <a target="_blank"
                               title={t('rundetail.artifacts.button.download')}
                               href={`${UrlConfig.getJenkinsRootURL()}${result._links.self.href}log/?start=0&download=true`}
                            >
                                <Icon style={style} icon="file_download" />
                            </a>
                        </td>
                    </tr>
                    { artifactsRendered }
                    <td colSpan="3"></td>
                </Table>
                <ShowMoreButton pager={this.pager} />
            </div>
        );
    }
}

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Page, Table, TextInput } from '@jenkins-cd/design-language';
import { i18nTranslator, ContentPageHeader, AppConfig, ShowMoreButton } from '@jenkins-cd/blueocean-core-js';
import Extensions from '@jenkins-cd/js-extensions';
import { documentTitle } from './DocumentTitle';
import CreatePipelineLink from './CreatePipelineLink';
import PipelineRowItem from './PipelineRowItem';
import PageLoading from './PageLoading';
import { observer } from 'mobx-react';

const translate = i18nTranslator('blueocean-dashboard');

@observer
export class Pipelines extends Component {
    constructor() {
        super();
        this.state = {};
    }
    onChange = (text) => {
        this.setState({ text });
    }
    _initPager() {
        console.log('state', this.state);
        const { params } = this.props;
        const org = params.organization;
        if (org) {
            this.pager = this.context.pipelineService.organiztionPipelinesPager(org);
        } else {
            if (this.state.text && this.state.text.length > 0) {
                this.pager = this.context.pipelineService.searchAllPipelinesPager(this.state.text);
                console.log('pager', this.pager);    
            } else {
                  console.log('here2');    
                this.pager = this.context.pipelineService.allPipelinesPager();
            }
        }
    }

    render() {
        this._initPager();
        const pipelines = this.pager.data;
        const { organization, location = { } } = this.context.params;

        const orgLink = organization ?
            <Link
                to={ `organizations/${organization}` }
                query={ location.query }
            >
                { organization }
            </Link> : '';

        const headers = [
            { label: translate('home.pipelineslist.header.name', { defaultValue: 'Name' }), className: 'name-col' },
            translate('home.pipelineslist.header.health', { defaultValue: 'Health' }),
            translate('home.pipelineslist.header.branches', { defaultValue: 'Branches' }),
            translate('home.pipelineslist.header.pullrequests', { defaultValue: 'PR' }),
            { label: '', className: 'actions-col' },
        ];
        this.props.setTitle('Jenkins Blue Ocean');
        return (
            <Page>
                <ContentPageHeader>
                    <div className="u-flex-grow">
                        <h1>
                            <Link to="/" query={ location.query }>
                                { translate('home.header.dashboard', { defaultValue: 'Dashboard' }) }
                            </Link>
                            { organization && ' / ' }
                            { organization && orgLink }
                        </h1>
                    </div>
                    <Extensions.Renderer extensionPoint="jenkins.pipeline.create.action">
                        <CreatePipelineLink />
                    </Extensions.Renderer>
                </ContentPageHeader>

                { !pipelines || this.pager.pending && <PageLoading /> }

                <main>
                    <article>
                        { /* TODO: need to adjust Extensions to make store available */ }
                        <Extensions.Renderer
                            extensionPoint="jenkins.pipeline.list.top"
                            store={ this.context.store }
                            router={ this.context.router }
                        />
                        <TextInput onChange={this.onChange}></TextInput>
                        <Table
                            className="pipelines-table"
                            headers={ headers }
                        >
                            { pipelines &&
                            pipelines.map(pipeline => {
                                const key = pipeline._links.self.href;
                                return (
                                    <PipelineRowItem
                                        t={ translate }
                                        key={ key } pipeline={ pipeline }
                                        showOrganization={ AppConfig.showOrg() }
                                    />
                                );
                            })
                            }
                        </Table>

                        { pipelines && <ShowMoreButton pager={this.pager} /> }
                    </article>
                </main>
            </Page>);
    }
}

const { func, object } = PropTypes;

Pipelines.contextTypes = {
    config: object,
    params: object,
    store: object,
    router: object,
    pipelineService: object,
    location: object.isRequired, // From react-router
};

Pipelines.propTypes = {
    setTitle: func,
    params: object,
};

export default documentTitle(Pipelines);

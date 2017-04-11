import React, {Component, PropTypes} from 'react';
import {
    CommitHash,
    ReadableDate,
    TimeDuration,
    TableRow,
    TableCell,
} from '@jenkins-cd/design-language';
import {
    logging,
    ReplayButton,
    RunButton,
    LiveStatusIndicator,
    TimeHarmonizer as timeHarmonizer,
} from '@jenkins-cd/blueocean-core-js';
import Extensions from '@jenkins-cd/js-extensions';

import { MULTIBRANCH_PIPELINE, SIMPLE_PIPELINE } from '../Capabilities';
import {buildRunDetailsUrl} from '../util/UrlUtils';
import IfCapability from './IfCapability';

// const logger = logging.logger('io.jenkins.blueocean.dashboard.Runs');

// TODO: Clean up imports and shit

/*
 http://localhost:8080/jenkins/blue/rest/organizations/jenkins/pipelines/PR-demo/runs
 */

class RunDetailsRow extends Component {

    openRunDetails = (newURL) => {
        const {router, location} = this.context;
        location.pathname = newURL;
        router.push(location);
    };

    render() {
        // TODO: Figure out why useRollover not working :(

        const {run, changeset, pipeline, t, locale, getTimes, columns} = this.props;

        if (!run || !pipeline) {
            return null;
        }

        const resultRun = run.result === 'UNKNOWN' ? run.state : run.result;
        const runDetailsUrl = buildRunDetailsUrl(pipeline.organization, pipeline.fullName, decodeURIComponent(run.pipeline), run.id, 'pipeline');

        const {
            durationMillis,
            endTime, 
            startTime,
        } = getTimes({
            result: resultRun,
            durationInMillis: run.durationInMillis,
            startTime: run.startTime,
            endTime: run.endTime,
        });

        const isRunning = run.state === 'RUNNING' || run.state === 'PAUSED' || run.state === 'QUEUED';

        const isMultibranch = false; // TODO: Find capabilities, check for multibranch somehow
        /*
         TODO: Used to use the following:
         <IfCapability className={pipeline._class} capability={MULTIBRANCH_PIPELINE} >
         <TableCell linkUrl={runDetailsUrl}>{decodeURIComponent(run.pipeline)}</TableCell>
         </IfCapability>

         */


        return (
            <TableRow useRollover columns={columns}>
                <TableCell>
                    <LiveStatusIndicator
                        durationInMillis={durationMillis}
                        result={resultRun}
                        startTime={startTime}
                        estimatedDuration={run.estimatedDurationInMillis}
                    />
                </TableCell>
                <TableCell>{run.id}</TableCell>
                <TableCell><CommitHash commitId={run.commitId}/></TableCell>
                { isMultibranch && (
                    <TableCell linkUrl={runDetailsUrl}>{decodeURIComponent(run.pipeline)}</TableCell>
                )}
                <TableCell>{changeset && changeset.msg || '-'}</TableCell>
                <TableCell>
                    <TimeDuration millis={durationMillis}
                                  updatePeriod={1000}
                                  liveUpdate={isRunning}
                                  locale={locale}
                                  displayFormat={t('common.date.duration.display.format', { defaultValue: 'M[ month] d[ days] h[ hours] m[ minutes] s[ seconds]' })}
                                  liveFormat={t('common.date.duration.format', { defaultValue: 'm[ minutes] s[ seconds]' })}
                                  hintFormat={t('common.date.duration.hint.format', { defaultValue: 'M [month], d [days], h[h], m[m], s[s]' })}
                    />
                </TableCell>
                <TableCell>
                    <ReadableDate date={endTime}
                                  liveUpdate
                                  locale={locale}
                                  shortFormat={t('common.date.readable.short', { defaultValue: 'MMM DD h:mma Z' })}
                                  longFormat={t('common.date.readable.long', { defaultValue: 'MMM DD YYYY h:mma Z' })}
                    />
                </TableCell>
                <TableCell>
                    <Extensions.Renderer extensionPoint="jenkins.pipeline.activity.list.action" {...t} />
                    <RunButton
                        className="icon-button"
                        runnable={this.props.pipeline}
                        latestRun={this.props.run}
                        buttonType="stop-only"
                    />
                    { /* TODO: check can probably removed and folded into ReplayButton once JENKINS-37519 is done */ }
                    <IfCapability className={pipeline._class} capability={[MULTIBRANCH_PIPELINE, SIMPLE_PIPELINE]}>
                        <ReplayButton className="icon-button" runnable={pipeline} latestRun={run} onNavigation={this.openRunDetails} />
                    </IfCapability>
                </TableCell>
            </TableRow>
        );
    }
}

RunDetailsRow.propTypes = {
    run: PropTypes.object,
    pipeline: PropTypes.object,
    locale: PropTypes.string,
    changeset: PropTypes.object.isRequired,
    t: PropTypes.func,
    getTimes: PropTypes.func,
    columns: PropTypes.object,
};

RunDetailsRow.contextTypes = {
    router: PropTypes.object.isRequired, // From react-router
    location: PropTypes.object,
};

const harmonized = timeHarmonizer(RunDetailsRow);
export {harmonized as RunDetailsRow};

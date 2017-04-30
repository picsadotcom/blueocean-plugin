import { assert } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';

import { pipelines } from './data/pipelines/pipelinesSingle';
import { latestRuns } from './data/runs/latestRuns';
import ArtifactsTable from '../../main/js/components/artifacts/ArtifactsTable';

const runs = latestRuns.map(run => (run.latestRun));


const contextWithArtifacts = {
    activityService: {
        fetchArtifacts() {
            return { value: runs[0].artifacts };
        },
    },
};

const contextNoData = {
    activityService: {
        fetchArtifacts() {
            return { value: [] };
        },
    },
};

const t = () => {};
describe('RunDetailsArtifacts', () => {
    describe('bad data', () => {
        it('renders nothing', () => {
            const mockPager = {
                data: []
            };
            const wrapper = shallow(<ArtifactsTable t={t} pager={mockPager} />);
            assert.isNull(wrapper.get(0));
        });
    });


    describe('valid artifacts', () => {
        it('renders a Table with expected data', () => {
            const artifacts = [];
            for (let i = 0; i < 99; i++) {
                artifacts.push({name: '1.txt', path: 'dir/1/1.txt', size: i*4, url: '/jenkins/job/jenkinsfile-experiments/branch/master/1/artifact/' + i + '.txt'});
            }
            const mockPager = {
                data: artifacts,
                hasMore: true
            };
            const wrapper = shallow(<ArtifactsTable t={t} result={runs[0]} pipeline={[pipelines[0]]} pager={mockPager} />, { context: contextWithArtifacts });

            assert.equal(wrapper.find('Table').length, 1);
            assert.equal(wrapper.find('Table tr').length, 201);

            const cols = wrapper.find('td');
            assert.equal(cols.length, 7);

            assert.equal(cols.at(0).text(), 'pipeline.log');
            assert.equal(cols.at(1).text(), '-');
            assert.equal(cols.at(2).text(), '<Icon />');

            assert.equal(cols.at(3).text(), 'hey');
            assert.equal(cols.at(4).text(), '<FileSize />');
            assert.equal(cols.at(5).text(), '<Icon />');

            assert.notNull(wrapper.find('.btn-show-more'));
        });
    });
});

import { BunkerService, Pager } from '@jenkins-cd/blueocean-core-js';

const PAGE_SIZE = 100;

export default class ArtifactService extends BunkerService {

    newArtifactsPager(pipeline, run) {
        return this.pagerService.getPager({
            key: `artifacts/${pipeline.organization}-${pipeline.name}-${run.id}/`,
            lazyPager: () => new Pager(run._links.self.href + 'artifacts', PAGE_SIZE, this),
        });
    }
}

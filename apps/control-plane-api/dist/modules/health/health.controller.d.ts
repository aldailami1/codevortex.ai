import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): {
        service: string;
        status: string;
        timestamp: string;
        version: string;
    };
}

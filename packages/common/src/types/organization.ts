import { OrganizationMemberRole } from './organizationMemberProfile';
import { ProjectType } from './projects';

/**
 * Details of a user's Organization
 */
export type Organization = {
    /**
     * The unique identifier of the organization
     * @format uuid
     */
    organizationUuid: string;
    /**
     * The name of the organization
     */
    name: string;

    /**
     * The default color palette for all projects in the organization
     */
    chartColors?: string[];
    /**
     * The organization needs a project if it doesn't have at least one project.
     */
    needsProject?: boolean;
    /**
     * The project a user sees when they first log in to the organization
     */
    defaultProjectUuid?: string;
};

export type CreateOrganization = Pick<Organization, 'name'>;

export type UpdateOrganization = Partial<
    Omit<Organization, 'organizationUuid' | 'needsProject'>
>;

export type ApiOrganization = {
    status: 'ok';
    results: Organization;
};

/**
 * Summary of a project under an organization
 */
export type OrganizationProject = {
    /**
     * The unique identifier of the project
     * @format uuid
     */
    projectUuid: string;
    name: string;
    type: ProjectType;
};

/**
 * List of projects in the current organization
 */
export type ApiOrganizationProjects = {
    status: 'ok';
    results: OrganizationProject[];
};

export type OnbordingRecord = {
    ranQueryAt: Date | null;
    shownSuccessAt: Date | null;
};

export type OnboardingStatus = {
    ranQuery: boolean;
};

export type ApiOnboardingStatusResponse = {
    status: 'ok';
    results: OnboardingStatus;
};

export type AllowedEmailDomainsRole =
    | OrganizationMemberRole.EDITOR
    | OrganizationMemberRole.INTERACTIVE_VIEWER
    | OrganizationMemberRole.VIEWER
    | OrganizationMemberRole.MEMBER;

export const AllowedEmailDomainsRoles: Array<AllowedEmailDomainsRole> = [
    OrganizationMemberRole.EDITOR,
    OrganizationMemberRole.INTERACTIVE_VIEWER,
    OrganizationMemberRole.VIEWER,
    OrganizationMemberRole.MEMBER,
];

export function isAllowedEmailDomainsRole(
    role: OrganizationMemberRole,
): role is AllowedEmailDomainsRole {
    return AllowedEmailDomainsRoles.includes(role as any);
}

export type AllowedEmailDomains = {
    organizationUuid: string;
    emailDomains: string[];
    role: AllowedEmailDomainsRole;
    projectUuids: string[];
};

export type UpdateAllowedEmailDomains = Omit<
    AllowedEmailDomains,
    'organizationUuid'
>;

export type ApiOrganizationAllowedEmailDomains = {
    status: 'ok';
    results: AllowedEmailDomains;
};

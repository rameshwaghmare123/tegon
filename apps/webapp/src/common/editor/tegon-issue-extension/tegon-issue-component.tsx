import { NodeViewWrapper } from '@tiptap/react';
import { getWorkflowColor } from 'common/status-color';
import { getWorkflowIcon } from 'common/workflow-icons';
import { useTeamWorkflows } from 'hooks/workflows';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { useContextStore } from 'store/global-context-provider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TegonIssueComponent = (props: any) => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { issuesStore, teamsStore } = useContextStore();

  const url = props.node.attrs.url;
  const identifier = url.split('/')[url.split('/').length - 1];
  const teamIdentifier = identifier.split('-')[0];

  const team = teamsStore.getTeamWithIdentifier(identifier.split('-')[0]);
  const workflows = useTeamWorkflows(teamIdentifier);

  const issue = team
    ? issuesStore.getIssueByNumber(identifier, team.id)
    : undefined;

  if (!issue) {
    return (
      <NodeViewWrapper className="react-component-with-content">
        <div className="content">{url}</div>
      </NodeViewWrapper>
    );
  }

  const workflow = workflows.find((workflow) => workflow.id === issue.stateId);

  const CategoryIcon = getWorkflowIcon(workflow);
  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className="content">
        <Link
          className="flex gap-1 bg-grayAlpha-100 p-1 px-2 w-fit rounded items-center"
          href={`/${workspaceSlug}/issue/${team.identifier}-${issue.number}`}
        >
          <CategoryIcon size={20} color={getWorkflowColor(workflow).color} />
          {issue.title}
        </Link>
      </div>
    </NodeViewWrapper>
  );
};

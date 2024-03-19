/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { CategoryViewItem } from './category-view-item';

export const CategoryView = observer(() => {
  const currentTeam = useCurrentTeam();

  const categorySequence = [
    WorkflowCategoryEnum.STARTED,
    WorkflowCategoryEnum.UNSTARTED,
    WorkflowCategoryEnum.COMPLETED,
    WorkflowCategoryEnum.BACKLOG,
    WorkflowCategoryEnum.CANCELED,
  ];

  function workflowSort(a: WorkflowType, b: WorkflowType): number {
    // Compare categories based on their sequence
    const categoryAIndex = categorySequence.indexOf(a.category);
    const categoryBIndex = categorySequence.indexOf(b.category);
    if (categoryAIndex !== categoryBIndex) {
      return categoryAIndex - categoryBIndex;
    }

    // If categories are the same, compare by position
    return a.position - b.position;
  }

  const workflows = useTeamWorkflows(currentTeam.identifier).sort(workflowSort);

  return (
    <div>
      {workflows.map((workflow: WorkflowType) => (
        <CategoryViewItem key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
});
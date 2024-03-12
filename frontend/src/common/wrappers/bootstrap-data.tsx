/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import * as React from 'react';

import type { BootstrapResponse } from 'common/types/data-loader';

import { Loader } from 'components/ui/loader';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useBootstrapRecords } from 'services/sync/bootstrap-sync';
import { useDeltaRecords } from 'services/sync/delta-sync';

import { MODELS } from 'store/models';

import { saveSocketData } from './socket-data-util';

interface Props {
  children: React.ReactElement;
}

export function BootstrapWrapper({ children }: Props) {
  const workspace = useCurrentWorkspace();
  const [loading, setLoading] = React.useState(true);
  const lastSequenceId = localStorage && localStorage.getItem('lastSequenceId');

  const { refetch: bootstrapIssuesRecords } = useBootstrapRecords({
    modelNames: Object.values(MODELS),
    workspaceId: workspace.id,
    onSuccess: (data: BootstrapResponse) => {
      saveSocketData(data.syncActions);
      localStorage.setItem('lastSequenceId', `${data.lastSequenceId}`);
    },
  });

  const { refetch: syncIssuesRecords } = useDeltaRecords({
    modelNames: Object.values(MODELS),
    workspaceId: workspace.id,
    lastSequenceId: lastSequenceId ? parseInt(lastSequenceId) : undefined,
    onSuccess: (data: BootstrapResponse) => {
      saveSocketData(data.syncActions);
    },
  });

  React.useEffect(() => {
    initStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initStore = async () => {
    if (lastSequenceId) {
      await syncIssuesRecords();
    } else {
      await bootstrapIssuesRecords();
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
}
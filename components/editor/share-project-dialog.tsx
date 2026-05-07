"use client";

import { useEffect, useMemo, useState } from "react";
import { Link2, Mail, Trash2, User } from "lucide-react";

import Button from "@/components/ui/button";
import Dialog, { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Input from "@/components/ui/input";

interface CollaboratorItem {
  email: string;
  name: string;
  avatarUrl: string | null;
}

interface ShareProjectDialogProps {
  open: boolean;
  projectId: string;
  isOwner: boolean;
  onClose: () => void;
}

export function ShareProjectDialog({ open, projectId, isOwner, onClose }: ShareProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const projectLink = useMemo(() => {
    if (typeof window === "undefined") {
      return `/editor/${projectId}`;
    }

    return `${window.location.origin}/editor/${projectId}`;
  }, [projectId]);

  const fetchCollaborators = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "GET",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load collaborators");
      }

      const payload = await response.json();
      setCollaborators(payload.collaborators ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load collaborators";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchCollaborators();
  }, [open, projectId]);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;

    setIsMutating(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to invite collaborator");
      }

      setInviteEmail("");
      await fetchCollaborators();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to invite collaborator";
      setErrorMessage(message);
    } finally {
      setIsMutating(false);
    }
  };

  const handleRemove = async (email: string) => {
    setIsMutating(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to remove collaborator");
      }

      await fetchCollaborators();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove collaborator";
      setErrorMessage(message);
    } finally {
      setIsMutating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite collaborators and manage workspace access."
              : "You can view who has access to this project."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-surface-border bg-base/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-faint">Project Link</p>
                <p className="mt-1 break-all text-sm text-copy-secondary">{projectLink}</p>
              </div>
              <Button type="button" variant="outline" onClick={handleCopyLink}>
                <Link2 className="h-4 w-4" />
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-state-error/40 bg-state-error/10 px-4 py-3 text-sm text-state-error">
              {errorMessage}
            </div>
          ) : null}

          {isOwner ? (
            <form onSubmit={handleInvite} className="rounded-2xl border border-surface-border bg-base/70 p-4">
              <label htmlFor="invite-email" className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-faint">
                Invite Collaborator
              </label>
              <div className="mt-3 flex items-center gap-2">
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="person@example.com"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                />
                <Button type="submit" variant="brand" disabled={!inviteEmail.trim() || isMutating}>
                  <Mail className="h-4 w-4" />
                  Invite
                </Button>
              </div>
            </form>
          ) : null}

          <div className="rounded-2xl border border-surface-border bg-base/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-faint">Collaborators</p>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
              {isLoading ? (
                <p className="text-sm text-copy-muted">Loading collaborators...</p>
              ) : collaborators.length === 0 ? (
                <p className="text-sm text-copy-muted">No collaborators yet.</p>
              ) : (
                collaborators.map((collaborator) => (
                  <div key={collaborator.email} className="flex items-center justify-between rounded-xl border border-surface-border bg-elevated/60 px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-3">
                      {collaborator.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={collaborator.avatarUrl}
                          alt={collaborator.name}
                          className="h-9 w-9 rounded-full border border-surface-border object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-subtle text-copy-muted">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-copy-primary">{collaborator.name}</p>
                        <p className="truncate text-xs text-copy-muted">{collaborator.email}</p>
                      </div>
                    </div>

                    {isOwner ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-state-error hover:bg-state-error/10 hover:text-state-error"
                        onClick={() => handleRemove(collaborator.email)}
                        disabled={isMutating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
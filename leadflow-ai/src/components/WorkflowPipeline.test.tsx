import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import WorkflowPipeline from "./WorkflowPipeline";

describe("WorkflowPipeline", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("animates nodes over 4 seconds and enables filtering on done", async () => {
    const onFilter = vi.fn();
    render(<WorkflowPipeline runSignal={1} canFilter={true} onNodeFilter={onFilter} />);

    // Initially, labels are present but not done
    expect(screen.getByText("SERP Search")).toBeInTheDocument();
    expect(screen.getByText("ABR Match")).toBeInTheDocument();

    // t0: running first nodes
    act(() => { vi.advanceTimersByTime(10); });
    // t1: progress
    act(() => { vi.advanceTimersByTime(1000); });
    // t2: progress
    act(() => { vi.advanceTimersByTime(1000); });
    // t3: assemble running
    act(() => { vi.advanceTimersByTime(1000); });
    // t4: done
    act(() => { vi.advanceTimersByTime(1000); });

    // Clicking a node calls filter handler
    fireEvent.click(screen.getByText("Extract Emails"));
    expect(onFilter).toHaveBeenCalled();
  });
});


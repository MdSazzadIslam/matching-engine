import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UploadArea } from "./index";

describe("UploadArea Component", () => {
  const defaultProps = {
    file: null,
    isDragging: false,
    onFileChange: jest.fn(),
    onDragEnter: jest.fn(),
    onDragLeave: jest.fn(),
    onDragOver: jest.fn(),
    onDrop: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial state correctly", () => {
    const { container } = render(<UploadArea {...defaultProps} />);

    expect(screen.getByText("Choose file")).toBeInTheDocument();
    expect(screen.getByText("No file chosen")).toBeInTheDocument();

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute("type", "file");
    expect(fileInput).toHaveAttribute("accept", ".txt");
  });

  it("displays file name when file is selected", () => {
    const file = new File([""], "test.txt", { type: "text/plain" });
    render(<UploadArea {...defaultProps} file={file} />);

    expect(screen.getByText("test.txt")).toBeInTheDocument();
    expect(screen.queryByText("No file chosen")).not.toBeInTheDocument();
  });

  it("applies dragging class when isDragging is true", () => {
    const { container } = render(
      <UploadArea {...defaultProps} isDragging={true} />
    );

    const uploadArea = container.querySelector(".upload-area");
    expect(uploadArea).toHaveClass("dragging");
  });

  it("handles file selection through input", () => {
    const { container } = render(<UploadArea {...defaultProps} />);

    const file = new File([""], "test.txt", { type: "text/plain" });
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(defaultProps.onFileChange).toHaveBeenCalled();

    const lastCall = defaultProps.onFileChange.mock.calls[0][0];
    expect(lastCall.target.files[0]).toBe(file);
  });

  it("handles drag events", () => {
    const { container } = render(<UploadArea {...defaultProps} />);
    const uploadArea = container.querySelector(".upload-area")!;

    // Create a file for testing
    const file = new File([""], "test.txt", { type: "text/plain" });
    const dataTransfer = {
      files: [file],
      items: [
        {
          kind: "file",
          type: file.type,
          getAsFile: () => file,
        },
      ],
      types: ["Files"],
    };

    // Test dragEnter
    fireEvent.dragEnter(uploadArea, {
      dataTransfer,
      preventDefault: jest.fn(),
    });
    expect(defaultProps.onDragEnter).toHaveBeenCalled();

    // Test dragOver
    fireEvent.dragOver(uploadArea, {
      dataTransfer,
      preventDefault: jest.fn(),
    });
    expect(defaultProps.onDragOver).toHaveBeenCalled();

    // Test dragLeave
    fireEvent.dragLeave(uploadArea, {
      dataTransfer,
      preventDefault: jest.fn(),
    });
    expect(defaultProps.onDragLeave).toHaveBeenCalled();

    // Test drop
    fireEvent.drop(uploadArea, {
      dataTransfer,
      preventDefault: jest.fn(),
    });
    expect(defaultProps.onDrop).toHaveBeenCalled();
  });

  it("prevents default on drag events", () => {
    const { container } = render(<UploadArea {...defaultProps} />);
    const uploadArea = container.querySelector(".upload-area")!;

    // Setup base event props
    const preventDefault = jest.fn();
    const eventProps = {
      preventDefault,
      dataTransfer: {
        files: [],
        items: [],
        types: ["Files"],
      },
    };

    // Test dragenter
    fireEvent.dragEnter(uploadArea, eventProps);
    const dragEnterCall = defaultProps.onDragEnter.mock.calls[0][0];
    expect(dragEnterCall.preventDefault).toBeDefined();
    expect(dragEnterCall.type).toBe("dragenter");

    // Test dragover
    fireEvent.dragOver(uploadArea, eventProps);
    const dragOverCall = defaultProps.onDragOver.mock.calls[0][0];
    expect(dragOverCall.preventDefault).toBeDefined();
    expect(dragOverCall.type).toBe("dragover");

    // Test dragleave
    fireEvent.dragLeave(uploadArea, eventProps);
    const dragLeaveCall = defaultProps.onDragLeave.mock.calls[0][0];
    expect(dragLeaveCall.preventDefault).toBeDefined();
    expect(dragLeaveCall.type).toBe("dragleave");

    // Test drop
    fireEvent.drop(uploadArea, eventProps);
    const dropCall = defaultProps.onDrop.mock.calls[0][0];
    expect(dropCall.preventDefault).toBeDefined();
    expect(dropCall.type).toBe("drop");

    // Verify all event handlers were called
    expect(defaultProps.onDragEnter).toHaveBeenCalled();
    expect(defaultProps.onDragOver).toHaveBeenCalled();
    expect(defaultProps.onDragLeave).toHaveBeenCalled();
    expect(defaultProps.onDrop).toHaveBeenCalled();
  });
});

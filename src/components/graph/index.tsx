import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useVaultStore } from "@/stores/vault-store";
import { useEditorStore } from "@/stores/editor-store";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  path: string;
  linkCount: number;
}

interface Edge extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  type: "wiki" | "markdown";
}

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { activeVaultPath } = useVaultStore();
  const { setActiveFilePath } = useEditorStore();

  useEffect(() => {
    if (!svgRef.current) return;

    // Mock data for now, in a real app this comes from Rust backend
    const nodes: Node[] = [
      { id: "1", label: "Note 1", path: "/note1.md", linkCount: 2 },
      { id: "2", label: "Note 2", path: "/note2.md", linkCount: 1 },
      { id: "3", label: "Note 3", path: "/note3.md", linkCount: 1 },
    ];
    const edges: Edge[] = [
      { source: "1", target: "2", type: "wiki" },
      { source: "1", target: "3", type: "markdown" },
    ];

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [0, 0, width, height]);

    svg.selectAll("*").remove(); // Clear previous render

    const g = svg.append("g");

    // Add zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Edge>(edges).id((d) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = g.append("g")
      .attr("stroke", "var(--muted-foreground)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke-width", 2);

    const node = g.append("g")
      .attr("stroke", "var(--background)")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => 5 + d.linkCount * 2)
      .attr("fill", "var(--primary)")
      .style("cursor", "pointer")
      .on("click", (_event, d) => {
        setActiveFilePath(d.path);
      });

    node.append("title").text((d) => d.label);

    const label = g.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.label)
      .attr("font-size", 12)
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("fill", "var(--foreground)");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);

      node
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!);

      label
        .attr("x", (d) => d.x!)
        .attr("y", (d) => d.y!);
    });

    return () => {
      simulation.stop();
    };
  }, [activeVaultPath, setActiveFilePath]);

  return (
    <div className="w-full h-full bg-background border-l border-border">
      <svg ref={svgRef} />
    </div>
  );
}

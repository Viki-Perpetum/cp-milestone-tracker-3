import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, Clock, FileX, Search, Eye, Building2, Banknote, HardHat } from "lucide-react";

type RiskLevel = "on-track" | "at-risk" | "blocked";
type CPStatus = { id: string; name: string; contractor: string; drawdownDate: string; belfiusCondition: string; missingDocs: string[]; risk: RiskLevel; progress: number; lastUpdate: string; };

const SAMPLE_CPS: CPStatus[] = [
  { id: "CP-01", name: "Foundation & Groundworks", contractor: "DemoBuild NV", drawdownDate: "2024-08-15", belfiusCondition: "BC-03: Structural engineer sign-off", missingDocs: [], risk: "on-track", progress: 100, lastUpdate: "2024-07-28" },
  { id: "CP-02", name: "Structural Frame", contractor: "IronFrame SA", drawdownDate: "2024-09-30", belfiusCondition: "BC-07: Inspection certificate", missingDocs: ["Inspection cert", "Insurance endorsement"], risk: "at-risk", progress: 72, lastUpdate: "2024-07-25" },
  { id: "CP-03", name: "Roofing & Waterproofing", contractor: "TopSeal BV", drawdownDate: "2024-10-20", belfiusCondition: "BC-11: Warranty certificate", missingDocs: ["Warranty cert", "Works acceptance form", "Photo report"], risk: "blocked", progress: 38, lastUpdate: "2024-07-20" },
  { id: "CP-04", name: "MEP Rough-in", contractor: "TechMEP SPRL", drawdownDate: "2024-11-05", belfiusCondition: "BC-14: Commissioning plan", missingDocs: ["Commissioning plan"], risk: "at-risk", progress: 55, lastUpdate: "2024-07-27" },
  { id: "CP-05", name: "Facade & Cladding", contractor: "CladdPro NV", drawdownDate: "2024-11-28", belfiusCondition: "BC-16: CE marking docs", missingDocs: [], risk: "on-track", progress: 61, lastUpdate: "2024-07-29" },
  { id: "CP-06", name: "Interior Partitions", contractor: "DryWall Partners", drawdownDate: "2024-12-10", belfiusCondition: "BC-19: Fire rating certs", missingDocs: ["Fire rating cert A", "Fire rating cert B"], risk: "blocked", progress: 20, lastUpdate: "2024-07-15" },
  { id: "CP-07", name: "Finishes & Fit-out", contractor: "FineLine GmbH", drawdownDate: "2025-01-15", belfiusCondition: "BC-22: Snag list closure", missingDocs: [], risk: "on-track", progress: 10, lastUpdate: "2024-07-29" },
];

const riskConfig: Record<RiskLevel, { label: string; color: string; icon: React.ReactNode }> = {
  "on-track": { label: "On Track", color: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  "at-risk":  { label: "At Risk",  color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock className="w-3.5 h-3.5" /> },
  "blocked":  { label: "Blocked",  color: "bg-red-100 text-red-800 border-red-200",    icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

export default function CpMilestoneTracker() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<CPStatus | null>(null);

  const filtered = useMemo(() => {
    return SAMPLE_CPS.filter(cp => {
      const matchesSearch = cp.name.toLowerCase().includes(search.toLowerCase()) || cp.contractor.toLowerCase().includes(search.toLowerCase()) || cp.id.toLowerCase().includes(search.toLowerCase());
      const matchesTab = tab === "all" || cp.risk === tab;
      return matchesSearch && matchesTab;
    });
  }, [search, tab]);

  const kpis = useMemo(() => ({
    total: SAMPLE_CPS.length,
    onTrack: SAMPLE_CPS.filter(c => c.risk === "on-track").length,
    atRisk: SAMPLE_CPS.filter(c => c.risk === "at-risk").length,
    blocked: SAMPLE_CPS.filter(c => c.risk === "blocked").length,
    missingDocs: SAMPLE_CPS.reduce((sum, c) => sum + c.missingDocs.length, 0),
  }), []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">CP Milestone Tracker</h1>
        <p className="text-muted-foreground mt-1">Single source of truth for Construction Packages, Belfius drawdown conditions, and contractor deliverables.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />Total CPs</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-foreground">{kpis.total}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />On Track</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-green-600">{kpis.onTrack}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-red-500" />Blocked</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-red-600">{kpis.blocked}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><FileX className="w-3.5 h-3.5 text-yellow-500" />Missing Docs</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-yellow-600">{kpis.missingDocs}</p></CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <CardTitle className="text-base font-semibold text-foreground">Construction Packages</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search CP, contractor…" value={search} onChange={e => setSearch(e.target.value)} className="pl-8 bg-background" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({kpis.total})</TabsTrigger>
              <TabsTrigger value="blocked">Blocked ({kpis.blocked})</TabsTrigger>
              <TabsTrigger value="at-risk">At Risk ({kpis.atRisk})</TabsTrigger>
              <TabsTrigger value="on-track">On Track ({kpis.onTrack})</TabsTrigger>
            </TabsList>
            <TabsContent value={tab}>
              <div className="rounded-md border border-border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-20">CP</TableHead>
                      <TableHead>Package Name</TableHead>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Belfius Condition</TableHead>
                      <TableHead>Drawdown Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Missing</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 && (
                      <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No results found.</TableCell></TableRow>
                    )}
                    {filtered.map(cp => {
                      const r = riskConfig[cp.risk];
                      return (
                        <TableRow key={cp.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs font-semibold text-primary">{cp.id}</TableCell>
                          <TableCell className="font-medium text-foreground">{cp.name}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{cp.contractor}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{cp.belfiusCondition}</TableCell>
                          <TableCell className="text-sm text-foreground">{cp.drawdownDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${ cp.risk === "blocked" ? "bg-red-500" : cp.risk === "at-risk" ? "bg-yellow-500" : "bg-green-500" }`} style={{ width: `${cp.progress}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{cp.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-xs flex items-center gap-1 w-fit ${r.color}`}>{r.icon}{r.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {cp.missingDocs.length > 0 ? (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">{cp.missingDocs.length} doc{cp.missingDocs.length > 1 ? "s" : ""}</Badge>
                            ) : (
                              <span className="text-xs text-green-600 font-medium">Complete</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" onClick={() => setSelected(cp)} className="h-7 w-7 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="font-mono text-primary">{selected.id}</span>
                <span>{selected.name}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs mb-0.5">Contractor</p><p className="font-medium text-foreground flex items-center gap-1"><HardHat className="w-3.5 h-3.5" />{selected.contractor}</p></div>
                <div><p className="text-muted-foreground text-xs mb-0.5">Drawdown Date</p><p className="font-medium text-foreground">{selected.drawdownDate}</p></div>
                <div><p className="text-muted-foreground text-xs mb-0.5">Progress</p><p className="font-semibold text-foreground">{selected.progress}%</p></div>
                <div><p className="text-muted-foreground text-xs mb-0.5">Last Updated</p><p className="font-medium text-foreground">{selected.lastUpdate}</p></div>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Banknote className="w-3.5 h-3.5" />Belfius Financing Condition</p>
                <p className="text-foreground">{selected.belfiusCondition}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1"><FileX className="w-3.5 h-3.5" />Missing Documents</p>
                {selected.missingDocs.length === 0 ? (
                  <p className="text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />All documents received</p>
                ) : (
                  <ul className="space-y-1">
                    {selected.missingDocs.map(doc => (
                      <li key={doc} className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{doc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Risk status:</span>
                <Badge variant="outline" className={`text-xs flex items-center gap-1 ${riskConfig[selected.risk].color}`}>{riskConfig[selected.risk].icon}{riskConfig[selected.risk].label}</Badge>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

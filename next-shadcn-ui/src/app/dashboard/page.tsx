"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Project = {
  id: number;
  name: string;
  description: string;
  category: string;
  priority: string;
  members: number[];
};

type Member = {
  userId: number;
  role: string;
  name: string;
  email: string;
  position: string;
  birthdate?: Date;
  phone: string;
  projectId: number | null;
  isActive: boolean;
};

type Task = {
  id: number;
  description: string;
  projectId: number;
  status: string;
  priority: string;
  userId: number;
  dateline?: Date;
};

type Settings = {
  appName: string;
  adminEmail: string;
  themeMode: string;
  notifications: boolean;
  tasksPerPage: number;
};

const initialProjects: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js.",
    category: "web",
    priority: "Alta",
    members: [1, 2],
  },
  {
    id: 2,
    name: "Mobile App",
    description: "Aplicación móvil para clientes.",
    category: "mobile",
    priority: "Media",
    members: [3],
  },
];

const initialMembers: Member[] = [
  {
    userId: 1,
    role: "admin",
    name: "María García",
    email: "maria@example.com",
    position: "Frontend Developer",
    birthdate: new Date(2000, 4, 12),
    phone: "987654321",
    projectId: 1,
    isActive: true,
  },
  {
    userId: 2,
    role: "developer",
    name: "Juan Pérez",
    email: "juan@example.com",
    position: "Backend Developer",
    birthdate: new Date(1999, 8, 20),
    phone: "912345678",
    projectId: 1,
    isActive: true,
  },
  {
    userId: 3,
    role: "designer",
    name: "Ana López",
    email: "ana@example.com",
    position: "UI/UX Designer",
    birthdate: new Date(2001, 2, 8),
    phone: "956789123",
    projectId: 2,
    isActive: false,
  },
];

const initialTasks: Task[] = [
  {
    id: 1,
    description: "Implementar autenticación",
    projectId: 1,
    status: "En progreso",
    priority: "Alta",
    userId: 1,
    dateline: new Date(2026, 5, 15),
  },
  {
    id: 2,
    description: "Diseñar pantalla de perfil",
    projectId: 2,
    status: "Pendiente",
    priority: "Media",
    userId: 3,
    dateline: new Date(2026, 5, 20),
  },
  {
    id: 3,
    description: "Configurar tabla de productos",
    projectId: 1,
    status: "Completado",
    priority: "Alta",
    userId: 2,
    dateline: new Date(2026, 5, 10),
  },
  {
    id: 4,
    description: "Crear documentación del dashboard",
    projectId: 1,
    status: "Pendiente",
    priority: "Baja",
    userId: 1,
    dateline: new Date(2026, 5, 25),
  },
  {
    id: 5,
    description: "Optimizar responsive del panel",
    projectId: 2,
    status: "En progreso",
    priority: "Urgente",
    userId: 3,
    dateline: new Date(2026, 5, 30),
  },
];

const initialSettings: Settings = {
  appName: "Dashboard Lab 11",
  adminEmail: "admin@tecsup.edu.pe",
  themeMode: "blue",
  notifications: true,
  tasksPerPage: 3,
};

const emptyProject: Omit<Project, "id"> = {
  name: "",
  description: "",
  category: "",
  priority: "",
  members: [],
};

const emptyMember: Omit<Member, "userId"> = {
  role: "",
  name: "",
  email: "",
  position: "",
  birthdate: undefined,
  phone: "",
  projectId: null,
  isActive: true,
};

const emptyTask: Omit<Task, "id"> = {
  description: "",
  projectId: 0,
  status: "",
  priority: "",
  userId: 0,
  dateline: undefined,
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [projectForm, setProjectForm] = useState<Omit<Project, "id">>(emptyProject);
  const [memberForm, setMemberForm] = useState<Omit<Member, "userId">>(emptyMember);
  const [taskForm, setTaskForm] = useState<Omit<Task, "id">>(emptyTask);

  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const [currentTaskPage, setCurrentTaskPage] = useState(1);

  const showError = (message: string) => {
    setAlertMessage(message);
    setSuccessMessage("");
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setAlertMessage("");
  };

  const simulateBackend = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
  };

  const getProjectName = (projectId: number | null) => {
    return projects.find((project) => project.id === projectId)?.name || "Sin proyecto";
  };

  const getMemberName = (userId: number) => {
    return members.find((member) => member.userId === userId)?.name || "Sin asignar";
  };

  const resetProjectForm = () => setProjectForm(emptyProject);
  const resetMemberForm = () => {
    setMemberForm(emptyMember);
    setEditingMemberId(null);
  };
  const resetTaskForm = () => {
    setTaskForm(emptyTask);
    setEditingTaskId(null);
  };

  const totalProjects = projects.length;
  const activeMembers = members.filter((member) => member.isActive).length;
  const completedTasks = tasks.filter((task) => task.status === "Completado").length;
  const pendingTasks = tasks.filter((task) => task.status === "Pendiente").length;

  const taskTotalPages = Math.max(1, Math.ceil(tasks.length / settings.tasksPerPage));

  const paginatedTasks = useMemo(() => {
    const start = (currentTaskPage - 1) * settings.tasksPerPage;
    const end = start + settings.tasksPerPage;
    return tasks.slice(start, end);
  }, [tasks, currentTaskPage, settings.tasksPerPage]);

  const createProject = async () => {
    if (!projectForm.name || !projectForm.category || !projectForm.priority) {
      showError("Completa nombre, categoría y prioridad del proyecto.");
      return;
    }

    await simulateBackend();

    const newProject: Project = {
      id: Date.now(),
      ...projectForm,
    };

    setProjects([...projects, newProject]);
    resetProjectForm();
    setProjectDialogOpen(false);
    showSuccess("Proyecto creado correctamente.");
  };

  const deleteProject = async (projectId: number) => {
    await simulateBackend();

    setProjects(projects.filter((project) => project.id !== projectId));
    setTasks(tasks.filter((task) => task.projectId !== projectId));
    setMembers(
      members.map((member) =>
        member.projectId === projectId ? { ...member, projectId: null } : member
      )
    );

    showSuccess("Proyecto eliminado correctamente.");
  };

  const saveMember = async () => {
    if (
      !memberForm.name ||
      !memberForm.email ||
      !memberForm.role ||
      !memberForm.position ||
      !memberForm.phone ||
      !memberForm.birthdate
    ) {
      showError("Completa todos los campos obligatorios del miembro.");
      return;
    }

    if (!memberForm.email.includes("@")) {
      showError("Ingresa un correo válido para el miembro.");
      return;
    }

    await simulateBackend();

    if (editingMemberId) {
      setMembers(
        members.map((member) =>
          member.userId === editingMemberId
            ? { userId: editingMemberId, ...memberForm }
            : member
        )
      );
      showSuccess("Miembro actualizado correctamente.");
    } else {
      setMembers([
        ...members,
        {
          userId: Date.now(),
          ...memberForm,
        },
      ]);
      showSuccess("Miembro creado correctamente.");
    }

    resetMemberForm();
    setMemberDialogOpen(false);
  };

  const editMember = (member: Member) => {
    setEditingMemberId(member.userId);
    setMemberForm({
      role: member.role,
      name: member.name,
      email: member.email,
      position: member.position,
      birthdate: member.birthdate,
      phone: member.phone,
      projectId: member.projectId,
      isActive: member.isActive,
    });
    setMemberDialogOpen(true);
  };

  const deleteMember = async (userId: number) => {
    await simulateBackend();

    setMembers(members.filter((member) => member.userId !== userId));
    setProjects(
      projects.map((project) => ({
        ...project,
        members: project.members.filter((memberId) => memberId !== userId),
      }))
    );
    setTasks(tasks.filter((task) => task.userId !== userId));

    showSuccess("Miembro eliminado correctamente.");
  };

  const toggleMemberStatus = async (userId: number) => {
    await simulateBackend();

    setMembers(
      members.map((member) =>
        member.userId === userId
          ? { ...member, isActive: !member.isActive }
          : member
      )
    );

    showSuccess("Estado del miembro actualizado.");
  };

  const saveTask = async () => {
    if (
      !taskForm.description ||
      !taskForm.projectId ||
      !taskForm.userId ||
      !taskForm.status ||
      !taskForm.priority ||
      !taskForm.dateline
    ) {
      showError("Completa todos los campos obligatorios de la tarea.");
      return;
    }

    await simulateBackend();

    if (editingTaskId) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { id: editingTaskId, ...taskForm } : task
        )
      );
      showSuccess("Tarea actualizada correctamente.");
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          ...taskForm,
        },
      ]);
      showSuccess("Tarea creada correctamente.");
    }

    resetTaskForm();
    setTaskDialogOpen(false);
  };

  const editTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      userId: task.userId,
      dateline: task.dateline,
    });
    setTaskDialogOpen(true);
  };

  const deleteTask = async (taskId: number) => {
    await simulateBackend();

    setTasks(tasks.filter((task) => task.id !== taskId));
    showSuccess("Tarea eliminada correctamente.");

    if (currentTaskPage > 1 && paginatedTasks.length === 1) {
      setCurrentTaskPage(currentTaskPage - 1);
    }
  };

  const saveSettings = async () => {
    if (!settings.appName || !settings.adminEmail) {
      showError("Completa el nombre de la aplicación y el correo administrador.");
      return;
    }

    if (!settings.adminEmail.includes("@")) {
      showError("El correo administrador no es válido.");
      return;
    }

    await simulateBackend();
    showSuccess("Configuración guardada correctamente.");
  };

  const priorityBadgeVariant = (priority: string) => {
    if (priority === "Urgente") return "destructive";
    if (priority === "Alta") return "default";
    if (priority === "Media") return "secondary";
    return "outline";
  };

  const statusBadgeVariant = (status: string) => {
    if (status === "Completado") return "default";
    if (status === "En progreso") return "secondary";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 rounded-2xl border bg-white/80 p-6 shadow-sm backdrop-blur">
          <Badge className="w-fit">Lab 11 Web Avanzado</Badge>
          <h1 className="text-4xl font-bold text-slate-900">
            Dashboard de Proyectos
          </h1>
          <p className="text-slate-600">
            CRUD en memoria con shadcn/ui, validaciones, spinner, calendario y paginación.
          </p>
        </div>

        {alertMessage && (
          <Alert variant="destructive">
            <AlertTitle>Error de validación</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert>
            <AlertTitle>Operación exitosa</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Total Proyectos" value={totalProjects} description="Datos en memoria" />
              <MetricCard title="Miembros Activos" value={activeMembers} description="Usuarios habilitados" />
              <MetricCard title="Tareas Completadas" value={completedTasks} description="Estado completado" />
              <MetricCard title="Tareas Pendientes" value={pendingTasks} description="Estado pendiente" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumen general</CardTitle>
                <CardDescription>
                  Las métricas se actualizan al crear, editar o eliminar datos.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <InfoBox label="Proyecto más reciente" value={projects.at(-1)?.name || "Sin proyectos"} />
                <InfoBox label="Último miembro" value={members.at(-1)?.name || "Sin miembros"} />
                <InfoBox label="Última tarea" value={tasks.at(-1)?.description || "Sin tareas"} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Proyectos</CardTitle>
                  <CardDescription>
                    Crea proyectos, asigna miembros, revisa detalles y elimina registros.
                  </CardDescription>
                </div>

                <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetProjectForm}>Nuevo Proyecto</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Crear nuevo proyecto</DialogTitle>
                      <DialogDescription>
                        Completa los datos del proyecto.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Nombre</Label>
                        <Input
                          value={projectForm.name}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, name: e.target.value })
                          }
                          placeholder="Sistema de ventas"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Descripción</Label>
                        <Textarea
                          value={projectForm.description}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Descripción breve del proyecto"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Categoría</Label>
                          <Select
                            value={projectForm.category}
                            onValueChange={(value) =>
                              setProjectForm({ ...projectForm, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="web">Desarrollo Web</SelectItem>
                              <SelectItem value="mobile">Mobile</SelectItem>
                              <SelectItem value="design">Diseño</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Prioridad</Label>
                          <Select
                            value={projectForm.priority}
                            onValueChange={(value) =>
                              setProjectForm({ ...projectForm, priority: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Baja">Baja</SelectItem>
                              <SelectItem value="Media">Media</SelectItem>
                              <SelectItem value="Alta">Alta</SelectItem>
                              <SelectItem value="Urgente">Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Miembros del equipo</Label>
                        <div className="grid gap-2 rounded-md border p-3">
                          {members.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              No hay miembros registrados.
                            </p>
                          )}

                          {members.map((member) => (
                            <label
                              key={member.userId}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Checkbox
                                checked={projectForm.members.includes(member.userId)}
                                onCheckedChange={(checked) => {
                                  const memberIds = checked
                                    ? [...projectForm.members, member.userId]
                                    : projectForm.members.filter(
                                      (id) => id !== member.userId
                                    );

                                  setProjectForm({
                                    ...projectForm,
                                    members: memberIds,
                                  });
                                }}
                              />
                              {member.name} - {member.position}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={createProject} disabled={loading}>
                        {loading && <Spinner className="mr-2" />}
                        Crear Proyecto
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                          </div>
                          <Badge variant={priorityBadgeVariant(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Categoría: <strong>{project.category}</strong>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Miembros asignados: <strong>{project.members.length}</strong>
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProject(project)}
                          >
                            Ver detalles
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteProject(project.id)}
                            disabled={loading}
                          >
                            {loading && <Spinner className="mr-2" />}
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Detalles del proyecto</DialogTitle>
                  <DialogDescription>
                    Información completa del proyecto seleccionado.
                  </DialogDescription>
                </DialogHeader>

                {selectedProject && (
                  <div className="space-y-3">
                    <InfoBox label="Nombre" value={selectedProject.name} />
                    <InfoBox label="Descripción" value={selectedProject.description || "Sin descripción"} />
                    <InfoBox label="Categoría" value={selectedProject.category} />
                    <InfoBox label="Prioridad" value={selectedProject.priority} />
                    <InfoBox
                      label="Miembros"
                      value={
                        selectedProject.members
                          .map((id) => getMemberName(id))
                          .join(", ") || "Sin miembros"
                      }
                    />
                    <InfoBox
                      label="Tareas relacionadas"
                      value={String(tasks.filter((task) => task.projectId === selectedProject.id).length)}
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Equipo</CardTitle>
                  <CardDescription>
                    CRUD de miembros del equipo con Calendar para fecha de nacimiento.
                  </CardDescription>
                </div>

                <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetMemberForm}>Nuevo Miembro</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMemberId ? "Editar miembro" : "Crear miembro"}
                      </DialogTitle>
                      <DialogDescription>
                        Completa los campos requeridos.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FieldInput label="Nombre" value={memberForm.name} onChange={(value) => setMemberForm({ ...memberForm, name: value })} />
                      <FieldInput label="Email" value={memberForm.email} onChange={(value) => setMemberForm({ ...memberForm, email: value })} />
                      <FieldInput label="Cargo / Position" value={memberForm.position} onChange={(value) => setMemberForm({ ...memberForm, position: value })} />
                      <FieldInput label="Teléfono" value={memberForm.phone} onChange={(value) => setMemberForm({ ...memberForm, phone: value })} />

                      <div className="grid gap-2">
                        <Label>Rol</Label>
                        <Select
                          value={memberForm.role}
                          onValueChange={(value) =>
                            setMemberForm({ ...memberForm, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="designer">Designer</SelectItem>
                            <SelectItem value="tester">Tester</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Proyecto asignado</Label>
                        <Select
                          value={memberForm.projectId ? String(memberForm.projectId) : "none"}
                          onValueChange={(value) =>
                            setMemberForm({
                              ...memberForm,
                              projectId: value === "none" ? null : Number(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona proyecto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sin proyecto</SelectItem>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={String(project.id)}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Fecha de nacimiento</Label>
                        <DatePicker
                          date={memberForm.birthdate}
                          onSelect={(date) =>
                            setMemberForm({ ...memberForm, birthdate: date })
                          }
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-7">
                        <Switch
                          checked={memberForm.isActive}
                          onCheckedChange={(checked) =>
                            setMemberForm({ ...memberForm, isActive: checked })
                          }
                        />
                        <Label>Miembro activo</Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMemberDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={saveMember} disabled={loading}>
                        {loading && <Spinner className="mr-2" />}
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableCaption>Miembros registrados en memoria</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Proyecto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.userId}>
                        <TableCell>{member.userId}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>{getProjectName(member.projectId)}</TableCell>
                        <TableCell>
                          <Badge variant={member.isActive ? "default" : "secondary"}>
                            {member.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => editMember(member)}>
                              Editar
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => toggleMemberStatus(member.userId)}>
                              Estado
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteMember(member.userId)}>
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Tareas</CardTitle>
                  <CardDescription>
                    CRUD de tareas con Calendar para fecha límite y paginación.
                  </CardDescription>
                </div>

                <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetTaskForm}>Nueva Tarea</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[650px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingTaskId ? "Editar tarea" : "Crear tarea"}
                      </DialogTitle>
                      <DialogDescription>
                        Completa los campos de la tarea.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Descripción</Label>
                        <Textarea
                          value={taskForm.description}
                          onChange={(e) =>
                            setTaskForm({ ...taskForm, description: e.target.value })
                          }
                          placeholder="Describe la tarea"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Proyecto</Label>
                          <Select
                            value={taskForm.projectId ? String(taskForm.projectId) : ""}
                            onValueChange={(value) =>
                              setTaskForm({ ...taskForm, projectId: Number(value) })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona proyecto" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects.map((project) => (
                                <SelectItem key={project.id} value={String(project.id)}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Responsable</Label>
                          <Select
                            value={taskForm.userId ? String(taskForm.userId) : ""}
                            onValueChange={(value) =>
                              setTaskForm({ ...taskForm, userId: Number(value) })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona miembro" />
                            </SelectTrigger>
                            <SelectContent>
                              {members.map((member) => (
                                <SelectItem key={member.userId} value={String(member.userId)}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Estado</Label>
                          <Select
                            value={taskForm.status}
                            onValueChange={(value) =>
                              setTaskForm({ ...taskForm, status: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pendiente">Pendiente</SelectItem>
                              <SelectItem value="En progreso">En progreso</SelectItem>
                              <SelectItem value="Completado">Completado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Prioridad</Label>
                          <Select
                            value={taskForm.priority}
                            onValueChange={(value) =>
                              setTaskForm({ ...taskForm, priority: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona prioridad" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Baja">Baja</SelectItem>
                              <SelectItem value="Media">Media</SelectItem>
                              <SelectItem value="Alta">Alta</SelectItem>
                              <SelectItem value="Urgente">Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Fecha límite</Label>
                          <DatePicker
                            date={taskForm.dateline}
                            onSelect={(date) =>
                              setTaskForm({ ...taskForm, dateline: date })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={saveTask} disabled={loading}>
                        {loading && <Spinner className="mr-2" />}
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent className="space-y-4">
                <Table>
                  <TableCaption>Lista paginada de tareas</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Proyecto</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Fecha límite</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.description}</TableCell>
                        <TableCell>{getProjectName(task.projectId)}</TableCell>
                        <TableCell>{getMemberName(task.userId)}</TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={priorityBadgeVariant(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.dateline ? format(task.dateline, "dd/MM/yyyy") : "Sin fecha"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => editTask(task)}>
                              Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}>
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentTaskPage(Math.max(1, currentTaskPage - 1));
                        }}
                      />
                    </PaginationItem>

                    {Array.from({ length: taskTotalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={currentTaskPage === index + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentTaskPage(index + 1);
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentTaskPage(
                            Math.min(taskTotalPages, currentTaskPage + 1)
                          );
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Formulario simulado de configuración de la aplicación.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-2">
                <FieldInput
                  label="Nombre de la aplicación"
                  value={settings.appName}
                  onChange={(value) => setSettings({ ...settings, appName: value })}
                />

                <FieldInput
                  label="Correo administrador"
                  value={settings.adminEmail}
                  onChange={(value) => setSettings({ ...settings, adminEmail: value })}
                />

                <div className="grid gap-2">
                  <Label>Tema visual</Label>
                  <Select
                    value={settings.themeMode}
                    onValueChange={(value) =>
                      setSettings({ ...settings, themeMode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Azul/Morado</SelectItem>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Tareas por página</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={settings.tasksPerPage}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tasksPerPage: Math.max(1, Number(e.target.value)),
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, notifications: checked })
                    }
                  />
                  <Label>Activar notificaciones simuladas</Label>
                </div>

                <div className="md:col-span-2">
                  <Button onClick={saveSettings} disabled={loading}>
                    {loading && <Spinner className="mr-2" />}
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white/70 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-slate-800">{value}</p>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function DatePicker({
  date,
  onSelect,
}: {
  date?: Date;
  onSelect: (date?: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start">
          {date ? format(date, "dd/MM/yyyy") : "Seleccionar fecha"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
}
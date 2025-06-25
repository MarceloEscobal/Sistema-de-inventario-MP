"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Lock, User, Calendar } from "lucide-react"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null)

  const handleLogin = () => {
    // Simulación de login - en producción conectar con backend
    if (credentials.username === "admin" && credentials.password === "admin") {
      setUserRole("admin")
    } else if (credentials.username === "user" && credentials.password === "user") {
      setUserRole("user")
    } else {
      alert("Credenciales incorrectas")
    }
  }

  if (userRole) {
    return <Dashboard userRole={userRole} setUserRole={setUserRole} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Sistema de Inventario</CardTitle>
          <CardDescription>Ministerio Público - Trujillo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Ingrese su usuario"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Iniciar Sesión
          </Button>
          <div className="text-sm text-muted-foreground text-center">
            <p>Demo: admin/admin (Administrador)</p>
            <p>Demo: user/user (Usuario)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Dashboard({
  userRole,
  setUserRole,
}: { userRole: "admin" | "user"; setUserRole: (role: "admin" | "user" | null) => void }) {
  const [activeModule, setActiveModule] = useState("dashboard")

  const handleLogout = () => {
    setUserRole(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={userRole} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar userRole={userRole} activeModule={activeModule} setActiveModule={setActiveModule} />
        <main className="flex-1 p-6">
          {activeModule === "dashboard" && <DashboardContent userRole={userRole} />}
          {activeModule === "bienes" && <BienesModule userRole={userRole} />}
          {activeModule === "inventario" && <InventarioModule />}
          {activeModule === "personal" && userRole === "admin" && <PersonalModule />}
          {activeModule === "centros" && userRole === "admin" && <CentrosModule />}
          {activeModule === "ubicacion" && userRole === "admin" && <UbicacionModule />}
          {activeModule === "reportes" && <ReportesModule userRole={userRole} />}
          {activeModule === "importar" && userRole === "admin" && <ImportarModule />}
        </main>
      </div>
    </div>
  )
}

function Header({ userRole, onLogout }: { userRole: "admin" | "user"; onLogout: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Sistema de Control de Inventario</h1>
            <p className="text-sm text-gray-500">Ministerio Público - Trujillo</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {userRole === "admin" ? "Administrador" : "Usuario"}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  )
}

function Sidebar({
  userRole,
  activeModule,
  setActiveModule,
}: {
  userRole: "admin" | "user"
  activeModule: string
  setActiveModule: (module: string) => void
}) {
  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", section: "" },
    {
      id: "bienes",
      label: "Gestión de Bienes",
      icon: "📦",
      section: "Módulo de Control y Administración de Bienes Muebles Patrimoniales",
    },
    { id: "inventario", label: "Gestión de Inventario", icon: "📋", section: "Módulo de Inventario" },
    { id: "personal", label: "Gestión de Personal", icon: "👥", section: "Módulo de Configuración" },
    { id: "centros", label: "Gestión de Centro de Costo", icon: "🏢", section: "Módulo de Configuración" },
    { id: "ubicacion", label: "Ubicación Física", icon: "📍", section: "Módulo de Configuración" },
    { id: "reportes", label: "Reportes", icon: "📋", section: "Otros" },
    { id: "importar", label: "Importar y Exportar", icon: "📁", section: "Otros" },
  ]

  const userMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", section: "" },
    { id: "inventario", label: "Gestión de Inventario", icon: "📋", section: "Módulo de Inventario" },
    { id: "reportes", label: "Reportes", icon: "📋", section: "Otros" },
  ]

  const menuItems = userRole === "admin" ? adminMenuItems : userMenuItems

  // Agrupar items por sección para admin
  const groupedItems =
    userRole === "admin"
      ? menuItems.reduce(
          (acc, item) => {
            const section = item.section || "main"
            if (!acc[section]) acc[section] = []
            acc[section].push(item)
            return acc
          },
          {} as Record<string, typeof menuItems>,
        )
      : { main: menuItems }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-4">
        {userRole === "admin"
          ? Object.entries(groupedItems).map(([section, items]) => (
              <div key={section}>
                {section !== "main" && section && (
                  <div className="text-xs text-gray-500 font-medium mb-2 px-2">{section}</div>
                )}
                <div className="space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                        activeModule === item.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))
          : // User sidebar with sections like admin
            Object.entries(groupedItems).map(([section, items]) => (
              <div key={section}>
                {section !== "main" && section && (
                  <div className="text-xs text-gray-500 font-medium mb-2 px-2">{section}</div>
                )}
                <div className="space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                        activeModule === item.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
      </nav>
    </aside>
  )
}

function DashboardContent({ userRole }: { userRole: "admin" | "user" }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Bienes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <p className="text-xs text-gray-500">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bienes Asignados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,089</div>
            <p className="text-xs text-gray-500">87% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bienes Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">158</div>
            <p className="text-xs text-gray-500">13% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Faltantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-gray-500">Requiere atención</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Actividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Importación de archivo SIGA</p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Asignación de laptop a Juan Pérez</p>
                  <p className="text-xs text-gray-500">Hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Reporte de inventario generado</p>
                  <p className="text-xs text-gray-500">Ayer</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Centros de Costo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sede Principal</span>
                <span className="text-sm font-medium">456 bienes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sede Norte</span>
                <span className="text-sm font-medium">321 bienes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sede Sur</span>
                <span className="text-sm font-medium">289 bienes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sede Este</span>
                <span className="text-sm font-medium">181 bienes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Modificar la función BienesModule para permitir que los usuarios también puedan agregar, editar y eliminar bienes
function BienesModule({ userRole }: { userRole: "admin" | "user" }) {
  const [bienes, setBienes] = useState([
    {
      id: "MP001234",
      codigoPatrimonial: "112228220002",
      codigoBarra: "112228220002",
      descripcion: "Laptop Dell Inspiron 15",
      marca: "Dell",
      modelo: "Inspiron 15 3000",
      serie: "DL123456789",
      estado: "Bueno",
      ubicacionFisica: "Oficina 201",
      responsable: "Juan Pérez",
      usuarioFinal: "Juan Pérez",
      centro: "Sede Principal",
      sede: "SEDE PRINCIPAL",
      centroCosto: "01.06-PRINCIPAL",
      valor: 2500.0,
      fechaIngreso: "2024-01-15",
      paisProcedencia: "PERU",
      tipoPatrimonio: "Bienes Muebles",
      tipoIngreso: "COMPRA",
      registradoPor: "Admin Sistema",
      fechaRegistro: "2024-01-15",
      observaciones: "Equipo en buen estado",
      caracteristicas: "Laptop para trabajo de oficina",
      medidas: "35x25x2 cm",
      nroContrato: "CON-2024-001",
      proveedor: "DELL PERU SAC",
      garantia: "24 meses",
      almacen: "ALMACEN CENTRAL",
      cuentaContable: "150302090101",
    },
    {
      id: "MP001235",
      codigoPatrimonial: "112228220003",
      codigoBarra: "112228220003",
      descripcion: "Impresora HP LaserJet",
      marca: "HP",
      modelo: "LaserJet Pro M404n",
      serie: "HP987654321",
      estado: "Regular",
      ubicacionFisica: "Oficina 105",
      responsable: "María García",
      usuarioFinal: "María García",
      centro: "Sede Norte",
      sede: "SEDE NORTE",
      centroCosto: "02.06-NORTE",
      valor: 800.0,
      fechaIngreso: "2024-01-10",
      paisProcedencia: "PERU",
      tipoPatrimonio: "Bienes Muebles",
      tipoIngreso: "COMPRA",
      registradoPor: "Admin Sistema",
      fechaRegistro: "2024-01-10",
      observaciones: "Impresora multifuncional",
      caracteristicas: "Impresora láser monocromática",
      medidas: "40x30x25 cm",
      nroContrato: "CON-2024-002",
      proveedor: "HP PERU SAC",
      garantia: "12 meses",
      almacen: "ALMACEN NORTE",
      cuentaContable: "150302090102",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("datos")
  const [formData, setFormData] = useState({
    // Datos del Activo Fijo
    item: "112228220001",
    codPatrimonial: "112228220001",
    descripcion: "DESHUMEDECEDOR PARA AMBIENTE TIPO COMERCIAL",
    sede: "ARCHIVO CENTRAL",
    centroCosto: "01.06-ARCHIVO",
    ubicFisica: "2004-ARCHIVO - PISO 2",
    responsable: "GUERRERO ESCOBEDO JHONY GERHARD",
    usuarioFinal: "GUERRERO ESCOBEDO JHONY GERHARD",
    nroSerieActivo: "59E0122QJ16",
    marcaActivo: "LG",
    modeloActivo: "S/M",
    medidas: "",
    caracteristicas: "DESHUMEDECEDOR PARA AMBIENTE TIPO COMERCIAL, M...",
    observaciones: "LIB-009458-24",

    // Campos derecha
    correlativo: "00003247",
    codigoBarraInvAnterior: "P148265",
    paisProcedencia: "PERU",
    estado: "Activo Fijo",
    tipoPatrimonio: "Bienes Muebles",
    mueblesEnseres: "Muebles y Enseres",
    sbn: true,
    activoDepreciable: true,
    salida: false,
    inst: true,
    tipoIngreso: "INVENTARIO INICIAL",
    fechaIngreso: "01/01/2019",
    verifFisicaDigital: true,
    etiquetado: false,

    // Ingreso del Bien por
    tipoIngresoBien: "OC", // "OC", "NEA", o ""
    numeroOC: "144",
    fechaOC: "15/03/2008",
    proveedor: "",
    valorCompra: "1,121.00",
    garantia: false,
    fechaGarantia: "00/00/0000",
    nroContrato: "",

    // Documentos
    altaTipoDoc: "Pedido - Comprobante de Salida (PECOSA)",
    nroDoc: "005909",
    fechaDoc: "15/03/2008",
    almacen: "001000-ALMACEN CENTRAL",
    ctaContable: "150302090l-AIRE ACONDICIONADO Y REFRIGERACIÓN",

    // Estados de conservación y uso
    estadoConserv: "Bueno",
    estadoUso: "Si",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastRegistered, setLastRegistered] = useState<any>(null)
  const [editingBien, setEditingBien] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [bienToDelete, setBienToDelete] = useState<any>(null)

  // En BienesModule, agregar estado para filtro
  const [filtroCodigoPatrimonial, setFiltroCodigoPatrimonial] = useState("")

  // Filtrar bienes por código patrimonial
  const bienesFiltrados = bienes.filter(
    (bien) =>
      filtroCodigoPatrimonial === "" ||
      bien.codigoPatrimonial.toLowerCase().includes(filtroCodigoPatrimonial.toLowerCase()),
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar código patrimonial único
    if (bienes.some((bien) => bien.codigoPatrimonial === formData.codPatrimonial && bien.id !== editingBien?.id)) {
      newErrors.codPatrimonial = "Este bien ya ha sido registrado"
    }

    // Campos requeridos
    if (!formData.codPatrimonial) newErrors.codPatrimonial = "Código patrimonial es requerido"
    if (!formData.descripcion) newErrors.descripcion = "Descripción es requerida"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const openModal = (bien?: any) => {
    if (bien) {
      // Modo edición
      setIsEditing(true)
      setEditingBien(bien)
      setFormData({
        item: bien.id,
        codPatrimonial: bien.codigoPatrimonial,
        descripcion: bien.descripcion,
        sede: bien.sede,
        centroCosto: bien.centroCosto,
        ubicFisica: bien.ubicacionFisica,
        responsable: bien.responsable,
        usuarioFinal: bien.usuarioFinal,
        nroSerieActivo: bien.serie,
        marcaActivo: bien.marca,
        modeloActivo: bien.modelo,
        medidas: bien.medidas,
        caracteristicas: bien.caracteristicas,
        observaciones: bien.observaciones,
        correlativo: "00003247",
        codigoBarraInvAnterior: bien.codigoBarra,
        paisProcedencia: bien.paisProcedencia,
        estado: "Activo Fijo",
        tipoPatrimonio: bien.tipoPatrimonio,
        mueblesEnseres: "Muebles y Enseres",
        sbn: true,
        activoDepreciable: true,
        salida: false,
        inst: true,
        tipoIngreso: bien.tipoIngreso,
        fechaIngreso: bien.fechaIngreso,
        verifFisicaDigital: true,
        etiquetado: false,
        tipoIngresoBien: "OC",
        numeroOC: "144",
        fechaOC: "15/03/2008",
        proveedor: bien.proveedor || "",
        valorCompra: bien.valor.toString(),
        garantia: false,
        fechaGarantia: "00/00/0000",
        nroContrato: bien.nroContrato || "",
        altaTipoDoc: "Pedido - Comprobante de Salida (PECOSA)",
        nroDoc: "005909",
        fechaDoc: "15/03/2008",
        almacen: bien.almacen,
        cuentaContable: bien.cuentaContable,
        estadoConserv: bien.estado,
        estadoUso: "Si",
      })
    } else {
      // Modo agregar
      setIsEditing(false)
      setEditingBien(null)
      setFormData({
        // Datos del Activo Fijo
        item: "112228220001",
        codPatrimonial: "",
        descripcion: "",
        sede: "",
        centroCosto: "",
        ubicFisica: "",
        responsable: "",
        usuarioFinal: "",
        nroSerieActivo: "",
        marcaActivo: "",
        modeloActivo: "",
        medidas: "",
        caracteristicas: "",
        observaciones: "",

        // Campos derecha
        correlativo: "00003247",
        codigoBarraInvAnterior: "",
        paisProcedencia: "PERU",
        estado: "Activo Fijo",
        tipoPatrimonio: "Bienes Muebles",
        mueblesEnseres: "Muebles y Enseres",
        sbn: true,
        activoDepreciable: true,
        salida: false,
        inst: true,
        tipoIngreso: "INVENTARIO INICIAL",
        fechaIngreso: "01/01/2019",
        verifFisicaDigital: true,
        etiquetado: false,

        // Ingreso del Bien por
        tipoIngresoBien: "OC", // "OC", "NEA", o ""
        numeroOC: "144",
        fechaOC: "15/03/2008",
        proveedor: "",
        valorCompra: "1,121.00",
        garantia: false,
        fechaGarantia: "00/00/0000",
        nroContrato: "",

        // Documentos
        altaTipoDoc: "Pedido - Comprobante de Salida (PECOSA)",
        nroDoc: "005909",
        fechaDoc: "15/03/2008",
        almacen: "001000-ALMACEN CENTRAL",
        ctaContable: "150302090l-AIRE ACONDICIONADO Y REFRIGERACIÓN",

        // Estados de conservación y uso
        estadoConserv: "Bueno",
        estadoUso: "Si",
      })
    }
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (isEditing && editingBien) {
      // Actualizar bien existente
      const updatedBien = {
        ...editingBien,
        codigoPatrimonial: formData.codPatrimonial,
        codigoBarra: formData.codigoBarraInvAnterior,
        descripcion: formData.descripcion,
        marca: formData.marcaActivo,
        modelo: formData.modeloActivo,
        serie: formData.nroSerieActivo,
        estado: formData.estadoConserv,
        ubicacionFisica: formData.ubicFisica,
        responsable: formData.responsable,
        usuarioFinal: formData.usuarioFinal,
        centro: formData.sede,
        sede: formData.sede,
        centroCosto: formData.centroCosto,
        valor: Number.parseFloat(formData.valorCompra.replace(",", ".")) || 0,
        fechaIngreso: formData.fechaIngreso,
        paisProcedencia: formData.paisProcedencia,
        tipoPatrimonio: formData.tipoPatrimonio,
        tipoIngreso: formData.tipoIngreso,
        observaciones: formData.observaciones,
        caracteristicas: formData.caracteristicas,
        medidas: formData.medidas,
        nroContrato: formData.nroContrato,
        proveedor: formData.proveedor,
        garantia: formData.garantia ? "Sí" : "No",
        almacen: formData.almacen,
        cuentaContable: formData.cuentaContable,
      }

      setBienes(bienes.map((bien) => (bien.id === editingBien.id ? updatedBien : bien)))
      setLastRegistered(updatedBien)
    } else {
      // Crear nuevo bien (código existente)
      const newBien = {
        id: `MP${String(bienes.length + 1).padStart(6, "0")}`,
        codigoPatrimonial: formData.codPatrimonial,
        codigoBarra: formData.codigoBarraInvAnterior,
        descripcion: formData.descripcion,
        marca: formData.marcaActivo,
        modelo: formData.modeloActivo,
        serie: formData.nroSerieActivo,
        estado: formData.estadoConserv,
        ubicacionFisica: formData.ubicFisica,
        responsable: formData.responsable,
        usuarioFinal: formData.usuarioFinal,
        centro: formData.sede,
        sede: formData.sede,
        centroCosto: formData.centroCosto,
        valor: Number.parseFloat(formData.valorCompra.replace(",", ".")) || 0,
        fechaIngreso: formData.fechaIngreso,
        paisProcedencia: formData.paisProcedencia,
        tipoPatrimonio: formData.tipoPatrimonio,
        tipoIngreso: formData.tipoIngreso,
        registradoPor: userRole === "admin" ? "Admin Sistema" : "Usuario Sistema",
        fechaRegistro: new Date().toISOString().split("T")[0],
        observaciones: formData.observaciones,
        caracteristicas: formData.caracteristicas,
        medidas: formData.medidas,
        nroContrato: formData.nroContrato,
        proveedor: formData.proveedor,
        garantia: formData.garantia ? "Sí" : "No",
        almacen: formData.almacen,
        cuentaContable: formData.cuentaContable,
      }
      setBienes([...bienes, newBien])
      setLastRegistered(newBien)
    }

    setShowSuccess(true)
    setShowModal(false)
    setIsEditing(false)
    setEditingBien(null)

    setTimeout(() => setShowSuccess(false), 5000)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleTipoIngresoBienChange = (tipo: string) => {
    setFormData({ ...formData, tipoIngresoBien: tipo })
  }

  const confirmDelete = (bien: any) => {
    setBienToDelete(bien)
    setShowDeleteConfirm(true)
  }

  const handleDelete = () => {
    if (bienToDelete) {
      setBienes(bienes.filter((bien) => bien.id !== bienToDelete.id))
      setShowDeleteConfirm(false)
      setBienToDelete(null)
      alert(`El bien ${bienToDelete.descripcion} ha sido eliminado.`)
    }
  }

  // Componente para campos de fecha con calendario
  const DateInput = ({
    value,
    onChange,
    placeholder,
  }: { value: string; onChange: (value: string) => void; placeholder?: string }) => {
    return (
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ""}
          className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
        />
        <button
          type="button"
          className="absolute right-1 top-0 h-full flex items-center justify-center"
          onClick={() => {
            /* Aquí iría la lógica para abrir el calendario */
          }}
        >
          <Calendar className="h-3 w-3 text-gray-500" />
        </button>
      </div>
    )
  }

  const [showInventarioUsuario, setShowInventarioUsuario] = useState(userRole === "user")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {userRole === "admin" ? "Gestión de Bienes" : "Inventario"}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="filtroPatrimonial">Filtrar por Código Patrimonial:</Label>
            <Input
              id="filtroPatrimonial"
              type="text"
              placeholder="Ingrese código de 12 dígitos"
              value={filtroCodigoPatrimonial}
              onChange={(e) => setFiltroCodigoPatrimonial(e.target.value)}
              className="w-64"
              maxLength={12}
            />
          </div>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {showSuccess && lastRegistered && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <span className="mr-2">✅</span>
              Bien Registrado Exitosamente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-700">Código:</span>
                <p className="text-green-600">{lastRegistered.codigoPatrimonial}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Descripción:</span>
                <p className="text-green-600">{lastRegistered.descripcion}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Marca:</span>
                <p className="text-green-600">{lastRegistered.marca}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Estado:</span>
                <p className="text-green-600">{lastRegistered.estado}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Responsable:</span>
                <p className="text-green-600">{lastRegistered.responsable}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Sede:</span>
                <p className="text-green-600">{lastRegistered.sede}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Valor:</span>
                <p className="text-green-600">S/ {lastRegistered.valor.toFixed(2)}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Registrado por:</span>
                <p className="text-green-600">{lastRegistered.registradoPor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && bienToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Está seguro que desea eliminar el bien <span className="font-bold">{bienToDelete.descripcion}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal del formulario SIGA */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold bg-gray-300 p-2 w-full">
                  {isEditing ? "Editar Activo Fijo" : "Datos del Activo Fijo"}
                </h2>
                <Button variant="outline" onClick={() => setShowModal(false)} className="ml-4">
                  ✕
                </Button>
              </div>

              <form onSubmit={handleSubmit}>
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      {/* Columna izquierda */}
                      <td className="w-1/2 align-top">
                        <table className="w-full border-collapse">
                          <tbody>
                            {/* Item */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200 w-32">Item</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.item}
                                  onChange={(e) => handleInputChange("item", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Código Patrimonial */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Cód. Patrimonial</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.codPatrimonial}
                                  onChange={(e) => handleInputChange("codPatrimonial", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                                {errors.codPatrimonial && (
                                  <span className="text-red-500 text-xs">{errors.codPatrimonial}</span>
                                )}
                              </td>
                            </tr>

                            {/* Descripción */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Descripción</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.descripcion}
                                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Sede */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Sede</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.sede}
                                  onChange={(e) => handleInputChange("sede", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Centro Costo */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Centro Costo</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.centroCosto}
                                  onChange={(e) => handleInputChange("centroCosto", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Ubic. Física */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Ubic. Física</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.ubicFisica}
                                  onChange={(e) => handleInputChange("ubicFisica", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Responsable */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Responsable</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.responsable}
                                  onChange={(e) => handleInputChange("responsable", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Usuario Final */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Usuario Final</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.usuarioFinal}
                                  onChange={(e) => handleInputChange("usuarioFinal", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Nro Serie */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Nro Serie</td>
                              <td className="border border-gray-300 p-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={formData.nroSerieActivo}
                                    onChange={(e) => handleInputChange("nroSerieActivo", e.target.value)}
                                    className="flex-1 border border-gray-300 h-6 text-xs px-1 outline-none"
                                  />
                                  <span className="text-xs whitespace-nowrap">Estado Conserv</span>
                                  <select
                                    value={formData.estadoConserv}
                                    onChange={(e) => handleInputChange("estadoConserv", e.target.value)}
                                    className="h-6 text-xs border border-gray-300 px-1 outline-none"
                                  >
                                    <option>Bueno</option>
                                    <option>Regular</option>
                                    <option>Malo</option>
                                  </select>
                                </div>
                              </td>
                            </tr>

                            {/* Marca */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Marca</td>
                              <td className="border border-gray-300 p-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={formData.marcaActivo}
                                    onChange={(e) => handleInputChange("marcaActivo", e.target.value)}
                                    className="flex-1 border border-gray-300 h-6 text-xs px-1 outline-none"
                                  />
                                  <span className="text-xs whitespace-nowrap">Estado Uso</span>
                                  <select
                                    value={formData.estadoUso}
                                    onChange={(e) => handleInputChange("estadoUso", e.target.value)}
                                    className="h-6 text-xs border border-gray-300 px-1 outline-none"
                                  >
                                    <option>Si</option>
                                    <option>No</option>
                                  </select>
                                </div>
                              </td>
                            </tr>

                            {/* Modelo */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Modelo</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.modeloActivo}
                                  onChange={(e) => handleInputChange("modeloActivo", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Medidas */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Medidas</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.medidas}
                                  onChange={(e) => handleInputChange("medidas", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Características */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Características</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.caracteristicas}
                                  onChange={(e) => handleInputChange("caracteristicas", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Observaciones */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Observaciones</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.observaciones}
                                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      {/* Columna derecha */}
                      <td className="w-1/2 align-top">
                        <table className="w-full border-collapse">
                          <tbody>
                            {/* Correlativo */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200 w-32">Correlativo</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.correlativo}
                                  onChange={(e) => handleInputChange("correlativo", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Código Barra / Inv. Anterior */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Código Barra / Inv. Anterior</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.codigoBarraInvAnterior}
                                  onChange={(e) => handleInputChange("codigoBarraInvAnterior", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* País de Procedencia y Estado */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">País de Procedencia</td>
                              <td className="border border-gray-300 p-2">
                                <select
                                  value={formData.paisProcedencia}
                                  onChange={(e) => handleInputChange("paisProcedencia", e.target.value)}
                                  className="w-full h-6 text-xs border border-gray-300 px-1 outline-none"
                                >
                                  <option value="PERU">PERU</option>
                                  <option value="CHINA">CHINA</option>
                                  <option value="USA">USA</option>
                                </select>
                              </td>
                              <td className="border border-gray-300 p-2 bg-gray-200">Estado</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.estado}
                                  onChange={(e) => handleInputChange("estado", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Tipo Patrimonio */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Tipo Patrimonio</td>
                              <td className="border border-gray-300 p-2" colSpan={3}>
                                <input
                                  type="text"
                                  value={formData.tipoPatrimonio}
                                  onChange={(e) => handleInputChange("tipoPatrimonio", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Muebles y Enseres */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200" colSpan={4}>
                                <input
                                  type="text"
                                  value={formData.mueblesEnseres}
                                  onChange={(e) => handleInputChange("mueblesEnseres", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none bg-gray-100"
                                />
                              </td>
                            </tr>

                            {/* Checkboxes en una fila */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">SBN</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="checkbox"
                                  checked={formData.sbn}
                                  onChange={(e) => handleInputChange("sbn", e.target.checked)}
                                />
                              </td>
                              <td className="border border-gray-300 p-2 bg-gray-200">Activo Depreciable</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="checkbox"
                                  checked={formData.activoDepreciable}
                                  onChange={(e) => handleInputChange("activoDepreciable", e.target.checked)}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Salida</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="checkbox"
                                  checked={formData.salida}
                                  onChange={(e) => handleInputChange("salida", e.target.checked)}
                                />
                              </td>
                              <td className="border border-gray-300 p-2 bg-gray-200">Inst</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="checkbox"
                                  checked={formData.inst}
                                  onChange={(e) => handleInputChange("inst", e.target.checked)}
                                />
                              </td>
                            </tr>

                            {/* Tipo Ingreso */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Tipo Ingreso</td>
                              <td className="border border-gray-300 p-2" colSpan={3}>
                                <input
                                  type="text"
                                  value={formData.tipoIngreso}
                                  onChange={(e) => handleInputChange("tipoIngreso", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Fecha Ingreso */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Fecha Ingreso</td>
                              <td className="border border-gray-300 p-2" colSpan={3}>
                                <DateInput
                                  value={formData.fechaIngreso}
                                  onChange={(value) => handleInputChange("fechaIngreso", value)}
                                />
                              </td>
                            </tr>

                            {/* Verif. Física/Digital y Etiquetado */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Verif. Física/Digital</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="checkbox"
                                  checked={formData.verifFisicaDigital}
                                  onChange={(e) => handleInputChange("verifFisicaDigital", e.target.checked)}
                                />
                              </td>
                              <td className="border border-gray-300 p-2 bg-gray-200">Etiquetado</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="checkbox"
                                  checked={formData.etiquetado}
                                  onChange={(e) => handleInputChange("etiquetado", e.target.checked)}
                                />
                              </td>
                            </tr>

                            {/* Ingreso del Bien por */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200" colSpan={4}>
                                <div className="font-medium mb-2">Ingreso del Bien por:</div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1">
                                      <input
                                        type="radio"
                                        name="tipoIngresoBien"
                                        checked={formData.tipoIngresoBien === "OC"}
                                        onChange={() => handleTipoIngresoBienChange("OC")}
                                      />
                                      O/C
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.numeroOC}
                                      onChange={(e) => handleInputChange("numeroOC", e.target.value)}
                                      placeholder="144"
                                      className="w-12 h-5 text-xs border border-gray-300 px-1 outline-none"
                                    />
                                    <span className="text-xs">Fecha</span>
                                    <DateInput
                                      value={formData.fechaOC}
                                      onChange={(value) => handleInputChange("fechaOC", value)}
                                      placeholder="15/03/2008"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1">
                                      <input
                                        type="radio"
                                        name="tipoIngresoBien"
                                        checked={formData.tipoIngresoBien === "NEA"}
                                        onChange={() => handleTipoIngresoBienChange("NEA")}
                                      />
                                      NEA
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs">Proveedor</span>
                                    <input
                                      type="text"
                                      value={formData.proveedor}
                                      onChange={(e) => handleInputChange("proveedor", e.target.value)}
                                      className="flex-1 h-5 text-xs border border-gray-300 px-1 outline-none"
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>

                            {/* Valor Compra */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Valor Compra</td>
                              <td className="border border-gray-300 p-2" colSpan={3}>
                                <input
                                  type="text"
                                  value={formData.valorCompra}
                                  onChange={(e) => handleInputChange("valorCompra", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Garantía */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Garantía</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="checkbox"
                                  checked={formData.garantia}
                                  onChange={(e) => handleInputChange("garantia", e.target.checked)}
                                />
                              </td>
                              <td className="border border-gray-300 p-2 bg-gray-200">Fecha</td>
                              <td className="border border-gray-300 p-2">
                                <DateInput
                                  value={formData.fechaGarantia}
                                  onChange={(value) => handleInputChange("fechaGarantia", value)}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Nº Contrato</td>
                              <td className="border border-gray-300 p-2" colSpan={3}>
                                <input
                                  type="text"
                                  value={formData.nroContrato}
                                  onChange={(e) => handleInputChange("nroContrato", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Alta Tipo Doc */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Alta</td>
                              <td className="border border-gray-300 p-2 bg-gray-200">Tipo Doc</td>
                              <td className="border border-gray-300 p-2" colSpan={2}>
                                <input
                                  type="text"
                                  value={formData.altaTipoDoc}
                                  onChange={(e) => handleInputChange("altaTipoDoc", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Nro Doc */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Nro Doc</td>
                              <td className="border border-gray-300 p-2">
                                <input
                                  type="text"
                                  value={formData.nroDoc}
                                  onChange={(e) => handleInputChange("nroDoc", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                              <td className="border border-gray-300 p-2 bg-gray-200">Fecha</td>
                              <td className="border border-gray-300 p-2">
                                <DateInput
                                  value={formData.fechaDoc}
                                  onChange={(value) => handleInputChange("fechaDoc", value)}
                                />
                              </td>
                            </tr>

                            {/* Almacén */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Almacén</td>
                              <td className="border border-gray-300 p-2" colSpan={3}>
                                <input
                                  type="text"
                                  value={formData.almacen}
                                  onChange={(e) => handleInputChange("almacen", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>

                            {/* Cta Contable */}
                            <tr>
                              <td className="border border-gray-300 p-2 bg-gray-200">Cta Contable</td>
                              <td className="border border-gray-300 p-2" colSpan={3}>
                                <input
                                  type="text"
                                  value={formData.ctaContable}
                                  onChange={(e) => handleInputChange("ctaContable", e.target.value)}
                                  className="w-full border border-gray-300 h-6 text-xs px-1 outline-none"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Pestañas inferiores */}
                <div className="mt-6">
                  <div className="flex border-b">
                    <button
                      type="button"
                      className={`px-4 py-2 ${
                        activeTab === "especificaciones" ? "bg-blue-100 border-b-2 border-blue-500" : ""
                      }`}
                      onClick={() => setActiveTab("especificaciones")}
                    >
                      Especificaciones Técnicas
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 ${activeTab === "valores" ? "bg-blue-100 border-b-2 border-blue-500" : ""}`}
                      onClick={() => setActiveTab("valores")}
                    >
                      Valores Contables
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 ${activeTab === "historicos" ? "bg-blue-100 border-b-2 border-blue-500" : ""}`}
                      onClick={() => setActiveTab("historicos")}
                    >
                      Históricos Ajustes
                    </button>
                  </div>

                  <div className="p-4 border border-t-0 min-h-[100px]">
                    {activeTab === "especificaciones" && (
                      <div>
                        <Label>Especificaciones Técnicas del Bien</Label>
                        <textarea className="w-full border rounded px-2 py-1 mt-2" rows={3}></textarea>
                      </div>
                    )}
                    {activeTab === "valores" && (
                      <div>
                        <Label>Información de Valores Contables</Label>
                        <div className="mt-2 text-sm text-gray-600">Contenido de valores contables...</div>
                      </div>
                    )}
                    {activeTab === "historicos" && (
                      <div>
                        <Label>Histórico de Ajustes</Label>
                        <div className="mt-2 text-sm text-gray-600">Contenido de históricos...</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones del modal */}
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">{isEditing ? "Actualizar Bien" : "Registrar Bien"}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lista de bienes existente */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Bienes Patrimoniales</CardTitle>
          <CardDescription>Gestión completa del inventario de bienes del Ministerio Público</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Código</th>
                  <th className="text-left p-2 font-medium">Descripción</th>
                  <th className="text-left p-2 font-medium">Marca/Modelo</th>
                  <th className="text-left p-2 font-medium">Serie</th>
                  <th className="text-left p-2 font-medium">Estado</th>
                  <th className="text-left p-2 font-medium">Responsable</th>
                  <th className="text-left p-2 font-medium">Centro</th>
                  <th className="text-left p-2 font-medium">Valor</th>
                  <th className="text-left p-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bienesFiltrados.map((bien) => (
                  <tr key={bien.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-sm">{bien.codigoPatrimonial}</td>
                    <td className="p-2">{bien.descripcion}</td>
                    <td className="p-2">
                      {bien.marca} {bien.modelo}
                    </td>
                    <td className="p-2 font-mono text-sm">{bien.serie}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          bien.estado === "Bueno"
                            ? "bg-green-100 text-green-800"
                            : bien.estado === "Regular"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bien.estado}
                      </span>
                    </td>
                    <td className="p-2">{bien.responsable}</td>
                    <td className="p-2">{bien.centro}</td>
                    <td className="p-2">S/ {bien.valor.toFixed(2)}</td>
                    <td className="p-2 space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openModal(bien)}>
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmDelete(bien)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PersonalModule() {
  const [personal, setPersonal] = useState([
    {
      id: 1,
      codigo: "001",
      apellidoPaterno: "PEREZ",
      apellidoMaterno: "GARCIA",
      nombres: "JUAN CARLOS",
      documentoIdent: "01",
      dni: "12345678",
      estadoCivil: "SOLTERO",
      sexo: "M",
      fechaNacimiento: "15/08/1985",
      peso: "75",
      nroRUC: "",
      libretaMilitar: "",
      nroPasaporte: "",
      nroSSPAFP: "",
      fechaIngreso: "01/03/2020",
      tipoEmpleado: "NOMBRADO",
      destacado: false,
      escala: "SP-ES",
      ejecutora: "001",
      profesion: "ABOGADO",
      profesionINEI: "2611",
      gradoInstruc: "UNIVERSITARIO",
      nroColegiatura: "12345",
      departamento: "LA LIBERTAD",
      provincia: "TRUJILLO",
      distrito: "TRUJILLO",
      direccion: "AV. AMERICA 123",
      interior: "",
      mz: "",
      lote: "",
      habitacion: "",
      nro: "123",
      telefono: "987654321",
      teleFax: "",
      email: "juan.perez@mp.gob.pe",
      usuario: "jperez",
      ciaDeposito: "",
      autorizadoEntregaPedidos: false,
      estado: "ACTIVO",
    },
    {
      id: 2,
      codigo: "002",
      apellidoPaterno: "RODRIGUEZ",
      apellidoMaterno: "SILVA",
      nombres: "MARIA ELENA",
      documentoIdent: "01",
      dni: "87654321",
      estadoCivil: "CASADO",
      sexo: "F",
      fechaNacimiento: "22/03/1990",
      peso: "60",
      nroRUC: "",
      libretaMilitar: "",
      nroPasaporte: "",
      nroSSPAFP: "",
      fechaIngreso: "15/06/2021",
      tipoEmpleado: "CONTRATADO",
      destacado: false,
      escala: "SP-ES",
      ejecutora: "001",
      profesion: "CONTADOR",
      profesionINEI: "2411",
      gradoInstruc: "UNIVERSITARIO",
      nroColegiatura: "54321",
      departamento: "LA LIBERTAD",
      provincia: "TRUJILLO",
      distrito: "TRUJILLO",
      direccion: "JR. BOLIVAR 456",
      interior: "",
      mz: "",
      lote: "",
      habitacion: "",
      nro: "456",
      telefono: "987123456",
      teleFax: "",
      email: "maria.rodriguez@mp.gob.pe",
      usuario: "mrodriguez",
      ciaDeposito: "",
      autorizadoEntregaPedidos: true,
      estado: "ACTIVO",
    },
    {
      id: 3,
      codigo: "003",
      apellidoPaterno: "GUERRERO",
      apellidoMaterno: "ESCOBEDO",
      nombres: "JHONY GERHARD",
      documentoIdent: "01",
      dni: "11223344",
      estadoCivil: "SOLTERO",
      sexo: "M",
      fechaNacimiento: "10/12/1988",
      peso: "80",
      nroRUC: "",
      libretaMilitar: "",
      nroPasaporte: "",
      nroSSPAFP: "",
      fechaIngreso: "01/01/2019",
      tipoEmpleado: "NOMBRADO",
      destacado: false,
      escala: "SP-ES",
      ejecutora: "001",
      profesion: "ADMINISTRADOR",
      profesionINEI: "1211",
      gradoInstruc: "UNIVERSITARIO",
      nroColegiatura: "98765",
      departamento: "LA LIBERTAD",
      provincia: "TRUJILLO",
      distrito: "TRUJILLO",
      direccion: "AV. LARCO 789",
      interior: "",
      mz: "",
      lote: "",
      habitacion: "",
      nro: "789",
      telefono: "987456789",
      teleFax: "",
      email: "jhony.guerrero@mp.gob.pe",
      usuario: "jguerrero",
      ciaDeposito: "",
      autorizadoEntregaPedidos: false,
      estado: "INACTIVO",
    },
    {
      id: 4,
      codigo: "004",
      apellidoPaterno: "LOPEZ",
      apellidoMaterno: "TORRES",
      nombres: "ANA LUCIA",
      documentoIdent: "01",
      dni: "55667788",
      estadoCivil: "CASADO",
      sexo: "F",
      fechaNacimiento: "05/07/1992",
      peso: "55",
      nroRUC: "",
      libretaMilitar: "",
      nroPasaporte: "",
      nroSSPAFP: "",
      fechaIngreso: "10/09/2022",
      tipoEmpleado: "CONTRATADO",
      destacado: true,
      escala: "SP-ES",
      ejecutora: "001",
      profesion: "PSICOLOGO",
      profesionINEI: "2634",
      gradoInstruc: "UNIVERSITARIO",
      nroColegiatura: "13579",
      departamento: "LA LIBERTAD",
      provincia: "TRUJILLO",
      distrito: "TRUJILLO",
      direccion: "AV. ESPAÑA 321",
      interior: "",
      mz: "",
      lote: "",
      habitacion: "",
      nro: "321",
      telefono: "987789123",
      teleFax: "",
      email: "ana.lopez@mp.gob.pe",
      usuario: "alopez",
      ciaDeposito: "",
      autorizadoEntregaPedidos: false,
      estado: "ACTIVO",
    },
  ])

  // Add delete confirmation state and function
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [personaToDelete, setPersonaToDelete] = useState<any>(null)

  const confirmDelete = (persona: any) => {
    setPersonaToDelete(persona)
    setShowDeleteConfirm(true)
  }

  const handleDelete = () => {
    if (personaToDelete) {
      setPersonal(personal.filter((p) => p.id !== personaToDelete.id))
      setShowDeleteConfirm(false)
      setPersonaToDelete(null)
      alert(`El personal ${personaToDelete.nombres} ${personaToDelete.apellidoPaterno} ha sido eliminado.`)
    }
  }

  // Add form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing && editingPersona) {
      const updatedPersona = {
        ...editingPersona,
        ...formData,
      }
      setPersonal(personal.map((p) => (p.id === editingPersona.id ? updatedPersona : p)))
      alert("Personal actualizado exitosamente")
    } else {
      const newPersona = {
        id: Math.max(...personal.map((p) => p.id)) + 1,
        ...formData,
      }
      setPersonal([...personal, newPersona])
      alert("Nuevo personal registrado exitosamente")
    }

    setShowModal(false)
    setIsEditing(false)
    setEditingPersona(null)
  }

  // Update the delete button in the table to use confirmDelete

  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("generales")
  const [editingPersona, setEditingPersona] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    codigo: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombres: "",
    documentoIdent: "01",
    dni: "",
    estadoCivil: "",
    sexo: "",
    fechaNacimiento: "",
    peso: "",
    nroRUC: "",
    libretaMilitar: "",
    nroPasaporte: "",
    nroSSPAFP: "",
    fechaIngreso: "",
    tipoEmpleado: "",
    destacado: false,
    escala: "",
    ejecutora: "",
    profesion: "",
    profesionINEI: "",
    gradoInstruc: "",
    nroColegiatura: "",
    departamento: "LA LIBERTAD",
    provincia: "TRUJILLO",
    distrito: "TRUJILLO",
    direccion: "",
    interior: "",
    mz: "",
    lote: "",
    habitacion: "",
    nro: "",
    telefono: "",
    teleFax: "",
    email: "",
    usuario: "",
    ciaDeposito: "",
    autorizadoEntregaPedidos: false,
    estado: "ACTIVO",
  })

  const openModal = (persona?: any) => {
    if (persona) {
      // Modo edición
      setIsEditing(true)
      setEditingPersona(persona)
      setFormData({
        codigo: persona.codigo,
        apellidoPaterno: persona.apellidoPaterno,
        apellidoMaterno: persona.apellidoMaterno,
        nombres: persona.nombres,
        documentoIdent: persona.documentoIdent,
        dni: persona.dni,
        estadoCivil: persona.estadoCivil,
        sexo: persona.sexo,
        fechaNacimiento: persona.fechaNacimiento,
        peso: persona.peso,
        nroRUC: persona.nroRUC,
        libretaMilitar: persona.libretaMilitar,
        nroPasaporte: persona.nroPasaporte,
        nroSSPAFP: persona.nroSSPAFP,
        fechaIngreso: persona.fechaIngreso,
        tipoEmpleado: persona.tipoEmpleado,
        destacado: persona.destacado,
        escala: persona.escala,
        ejecutora: persona.ejecutora,
        profesion: persona.profesion,
        profesionINEI: persona.profesionINEI,
        gradoInstruc: persona.gradoInstruc,
        nroColegiatura: persona.nroColegiatura,
        departamento: persona.departamento,
        provincia: persona.provincia,
        distrito: persona.distrito,
        direccion: persona.direccion,
        interior: persona.interior,
        mz: persona.mz,
        lote: persona.lote,
        habitacion: persona.habitacion,
        nro: persona.nro,
        telefono: persona.telefono,
        teleFax: persona.teleFax,
        email: persona.email,
        usuario: persona.usuario,
        ciaDeposito: persona.ciaDeposito,
        autorizadoEntregaPedidos: persona.autorizadoEntregaPedidos,
        estado: persona.estado,
      })
    } else {
      // Modo agregar
      setIsEditing(false)
      setEditingPersona(null)
      setFormData({
        codigo: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        nombres: "",
        documentoIdent: "01",
        dni: "",
        estadoCivil: "",
        sexo: "",
        fechaNacimiento: "",
        peso: "",
        nroRUC: "",
        libretaMilitar: "",
        nroPasaporte: "",
        nroSSPAFP: "",
        fechaIngreso: "",
        tipoEmpleado: "",
        destacado: false,
        escala: "",
        ejecutora: "",
        profesion: "",
        profesionINEI: "",
        gradoInstruc: "",
        nroColegiatura: "",
        departamento: "LA LIBERTAD",
        provincia: "TRUJILLO",
        distrito: "TRUJILLO",
        direccion: "",
        interior: "",
        mz: "",
        lote: "",
        habitacion: "",
        nro: "",
        telefono: "",
        teleFax: "",
        email: "",
        usuario: "",
        ciaDeposito: "",
        autorizadoEntregaPedidos: false,
        estado: "ACTIVO",
      })
    }
    setShowModal(true)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Personal</h2>
        <Button onClick={() => openModal()}>Nuevo Registro de Personal</Button>
      </div>

      {/* Modal con formulario completo según imagen */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Nuevo registro de personal</h2>
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  ✕
                </Button>
              </div>

              {/* Pestañas */}
              <div className="flex border-b mb-6">
                <button
                  className={`px-4 py-2 ${activeTab === "generales" ? "bg-blue-100 border-b-2 border-blue-500" : ""}`}
                  onClick={() => setActiveTab("generales")}
                >
                  Datos Generales
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "otros" ? "bg-blue-100 border-b-2 border-blue-500" : ""}`}
                  onClick={() => setActiveTab("otros")}
                >
                  Otros Datos
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "movimientos" ? "bg-blue-100 border-b-2 border-blue-500" : ""}`}
                  onClick={() => setActiveTab("movimientos")}
                >
                  Movimientos
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === "generales" && (
                  <div className="grid grid-cols-3 gap-6">
                    {/* Columna 1 - Datos Generales */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-blue-600">Datos Generales</h3>

                      <div>
                        <Label>Código</Label>
                        <Input value={formData.codigo} onChange={(e) => handleInputChange("codigo", e.target.value)} />
                      </div>

                      <div>
                        <Label>Apellido Paterno</Label>
                        <Input
                          value={formData.apellidoPaterno}
                          onChange={(e) => handleInputChange("apellidoPaterno", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Apellido Materno</Label>
                        <Input
                          value={formData.apellidoMaterno}
                          onChange={(e) => handleInputChange("apellidoMaterno", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Nombres</Label>
                        <Input
                          value={formData.nombres}
                          onChange={(e) => handleInputChange("nombres", e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="w-20">
                          <Label>Documento Ident.</Label>
                          <select
                            className="w-full border rounded px-2 py-1"
                            value={formData.documentoIdent}
                            onChange={(e) => handleInputChange("documentoIdent", e.target.value)}
                          >
                            <option value="01">01</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <Label>DNI</Label>
                          <Input value={formData.dni} onChange={(e) => handleInputChange("dni", e.target.value)} />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Estado Civil</Label>
                          <select
                            className="w-full border rounded px-2 py-1"
                            value={formData.estadoCivil}
                            onChange={(e) => handleInputChange("estadoCivil", e.target.value)}
                          >
                            <option value="">Seleccionar</option>
                            <option value="SOLTERO">SOLTERO</option>
                            <option value="CASADO">CASADO</option>
                          </select>
                        </div>
                        <div className="w-20">
                          <Label>Sexo</Label>
                          <select
                            className="w-full border rounded px-2 py-1"
                            value={formData.sexo}
                            onChange={(e) => handleInputChange("sexo", e.target.value)}
                          >
                            <option value="">-</option>
                            <option value="M">M</option>
                            <option value="F">F</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Fec. Nacimiento</Label>
                          <Input
                            type="date"
                            value={formData.fechaNacimiento}
                            onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                          />
                        </div>
                        <div className="w-20">
                          <Label>Peso</Label>
                          <Input
                            value={formData.peso}
                            placeholder="000"
                            onChange={(e) => handleInputChange("peso", e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Nro. RUC</Label>
                        <Input value={formData.nroRUC} onChange={(e) => handleInputChange("nroRUC", e.target.value)} />
                      </div>

                      <div>
                        <Label>Libreta Militar</Label>
                        <Input
                          value={formData.libretaMilitar}
                          onChange={(e) => handleInputChange("libretaMilitar", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Nro Pasaporte</Label>
                        <Input
                          value={formData.nroPasaporte}
                          onChange={(e) => handleInputChange("nroPasaporte", e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Nro S.S.P/AFP</Label>
                          <select className="w-full border rounded px-2 py-1">
                            <option value="">-</option>
                          </select>
                        </div>
                        <div className="w-8">
                          <Label>&nbsp;</Label>
                          <Input
                            value={formData.nroSSPAFP}
                            onChange={(e) => handleInputChange("nroSSPAFP", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Columna 2 - Datos Laborales */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-blue-600">Datos Laborales</h3>

                      <div>
                        <Label>Fecha Ingreso</Label>
                        <Input
                          type="date"
                          value={formData.fechaIngreso}
                          onChange={(e) => handleInputChange("fechaIngreso", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Tipo Empleado</Label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={formData.tipoEmpleado}
                          onChange={(e) => handleInputChange("tipoEmpleado", e.target.value)}
                        >
                          <option value="">Seleccionar</option>
                          <option value="NOMBRADO">NOMBRADO</option>
                          <option value="CONTRATADO">CONTRATADO</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.destacado}
                          onChange={(e) => handleInputChange("destacado", e.target.checked)}
                        />
                        <Label>Destacado</Label>
                      </div>

                      <div>
                        <Label>Escala</Label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={formData.escala}
                          onChange={(e) => handleInputChange("escala", e.target.value)}
                        >
                          <option value="">Seleccionar</option>
                          <option value="SP-ES">SP-ES</option>
                        </select>
                      </div>

                      <div>
                        <Label>Ejecutora</Label>
                        <Input
                          value={formData.ejecutora}
                          onChange={(e) => handleInputChange("ejecutora", e.target.value)}
                        />
                      </div>

                      <h3 className="font-bold text-blue-600 pt-4">Datos Profesionales</h3>

                      <div>
                        <Label>Profesión</Label>
                        <Input
                          value={formData.profesion}
                          onChange={(e) => handleInputChange("profesion", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Profesión INEI</Label>
                        <Input
                          value={formData.profesionINEI}
                          onChange={(e) => handleInputChange("profesionINEI", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Grado Instruc.</Label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={formData.gradoInstruc}
                          onChange={(e) => handleInputChange("gradoInstruc", e.target.value)}
                        >
                          <option value="">Seleccionar</option>
                          <option value="UNIVERSITARIO">UNIVERSITARIO</option>
                        </select>
                      </div>

                      <div>
                        <Label>Nro Colegiatura</Label>
                        <Input
                          value={formData.nroColegiatura}
                          onChange={(e) => handleInputChange("nroColegiatura", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Columna 3 - Datos Complementarios y Estado */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-blue-600">Datos Complementarios</h3>
                        <div className="flex items-center gap-2">
                          <Label>Estado:</Label>
                          <select
                            className="border rounded px-2 py-1"
                            value={formData.estado}
                            onChange={(e) => handleInputChange("estado", e.target.value)}
                          >
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label>Departamento</Label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={formData.departamento}
                          onChange={(e) => handleInputChange("departamento", e.target.value)}
                        >
                          <option value="LA LIBERTAD">LA LIBERTAD</option>
                        </select>
                      </div>

                      <div>
                        <Label>Prov.</Label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={formData.provincia}
                          onChange={(e) => handleInputChange("provincia", e.target.value)}
                        >
                          <option value="TRUJILLO">TRUJILLO</option>
                        </select>
                      </div>

                      <div>
                        <Label>Dist.</Label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={formData.distrito}
                          onChange={(e) => handleInputChange("distrito", e.target.value)}
                        >
                          <option value="TRUJILLO">TRUJILLO</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <div className="w-16">
                          <Label>Dirección</Label>
                          <select className="w-full border rounded px-2 py-1">
                            <option value="AV">AV</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <Label>&nbsp;</Label>
                          <Input
                            value={formData.direccion}
                            onChange={(e) => handleInputChange("direccion", e.target.value)}
                          />
                        </div>
                        <div className="w-16">
                          <Label>Nro:</Label>
                          <Input value={formData.nro} onChange={(e) => handleInputChange("nro", e.target.value)} />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Interior</Label>
                          <Input
                            value={formData.interior}
                            onChange={(e) => handleInputChange("interior", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Mz.</Label>
                          <Input value={formData.mz} onChange={(e) => handleInputChange("mz", e.target.value)} />
                        </div>
                        <div>
                          <Label>Lote</Label>
                          <Input value={formData.lote} onChange={(e) => handleInputChange("lote", e.target.value)} />
                        </div>
                      </div>

                      <div>
                        <Label>Habitación</Label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={formData.habitacion}
                          onChange={(e) => handleInputChange("habitacion", e.target.value)}
                        >
                          <option value="">Seleccionar</option>
                        </select>
                      </div>

                      <div>
                        <Label>E-mail</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Teléfonos</Label>
                          <Input
                            value={formData.telefono}
                            onChange={(e) => handleInputChange("telefono", e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <Label>TeleFax</Label>
                          <Input
                            value={formData.teleFax}
                            onChange={(e) => handleInputChange("teleFax", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Usuario</Label>
                          <Input
                            value={formData.usuario}
                            onChange={(e) => handleInputChange("usuario", e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <Label>Cía. Depósito</Label>
                          <select className="w-full border rounded px-2 py-1">
                            <option value="">Seleccionar</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.autorizadoEntregaPedidos}
                          onChange={(e) => handleInputChange("autorizadoEntregaPedidos", e.target.checked)}
                        />
                        <Label>Autorizado en la entrega de Pedidos</Label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">{isEditing ? "Actualizar" : "Registrar"}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lista simplificada para mostrar */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Código</th>
                  <th className="text-left p-2">Apellidos y Nombres</th>
                  <th className="text-left p-2">DNI</th>
                  <th className="text-left p-2">Profesión</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {personal.map((persona) => (
                  <tr key={persona.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{persona.codigo}</td>
                    <td className="p-2">
                      {persona.apellidoPaterno} {persona.apellidoMaterno}, {persona.nombres}
                    </td>
                    <td className="p-2">{persona.dni}</td>
                    <td className="p-2">{persona.profesion}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          persona.estado === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {persona.estado}
                      </span>
                    </td>
                    <td className="p-2 space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openModal(persona)}>
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => confirmDelete(persona)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CentrosModule() {
  const [centros, setCentros] = useState([
    {
      id: 1,
      codigo: "2",
      descripcion: "SAN LUIS",
      direccion: "AV. SAN LUIS 123",
      referencia: "CERCA AL PARQUE",
      pais: "PERU",
      departamento: "LA LIBERTAD",
      provincia: "TRUJILLO",
      distrito: "TRUJILLO",
      telefonoAnexo: "044-123456",
      fechaRegistro: "2024-01-15",
      ambito: "REGIONAL",
    },
    {
      id: 2,
      codigo: "3",
      descripcion: "NEW YORK - AREAS ADMINISTRATIVA",
      direccion: "AV. NEW YORK 456",
      referencia: "EDIFICIO ADMINISTRATIVO",
      pais: "PERU",
      departamento: "LA LIBERTAD",
      provincia: "TRUJILLO",
      distrito: "TRUJILLO",
      telefonoAnexo: "044-789012",
      fechaRegistro: "2024-02-10",
      ambito: "LOCAL",
    },
    {
      id: 3,
      codigo: "4",
      descripcion: "COVICORTI",
      direccion: "JR. COVICORTI 789",
      referencia: "ZONA COMERCIAL",
      pais: "PERU",
      departamento: "LA LIBERTAD",
      provincia: "TRUJILLO",
      distrito: "TRUJILLO",
      telefonoAnexo: "044-345678",
      fechaRegistro: "2024-03-05",
      ambito: "LOCAL",
    },
    {
      id: 4,
      codigo: "24",
      descripcion: "UNIDAD DE FLAGRANCIA",
      direccion: "LOS GRANADOS",
      referencia: "",
      pais: "PERU",
      departamento: "LA LIBERTAD",
      provincia: "TRUJILLO",
      distrito: "TRUJILLO",
      telefonoAnexo: "",
      fechaRegistro: "05/05/2025",
      ambito: "",
    },
  ])

  const [editingCentro, setEditingCentro] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [centroToDelete, setCentroToDelete] = useState<any>(null)

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    direccion: "",
    referencia: "",
    pais: "PERU",
    departamento: "LA LIBERTAD",
    provincia: "TRUJILLO",
    distrito: "TRUJILLO",
    telefonoAnexo: "",
    fechaRegistro: "",
    ambito: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const openModal = (centro?: any) => {
    if (centro) {
      setIsEditing(true)
      setEditingCentro(centro)
      setFormData({
        codigo: centro.codigo,
        descripcion: centro.descripcion,
        direccion: centro.direccion,
        referencia: centro.referencia,
        pais: centro.pais,
        departamento: centro.departamento,
        provincia: centro.provincia,
        distrito: centro.distrito,
        telefonoAnexo: centro.telefonoAnexo,
        fechaRegistro: centro.fechaRegistro,
        ambito: centro.ambito,
      })
    } else {
      setIsEditing(false)
      setEditingCentro(null)
      setFormData({
        codigo: "",
        descripcion: "",
        direccion: "",
        referencia: "",
        pais: "PERU",
        departamento: "LA LIBERTAD",
        provincia: "TRUJILLO",
        distrito: "TRUJILLO",
        telefonoAnexo: "",
        fechaRegistro: new Date().toISOString().split("T")[0],
        ambito: "",
      })
    }
    setShowModal(true)
  }

  const confirmDelete = (centro: any) => {
    setCentroToDelete(centro)
    setShowDeleteConfirm(true)
  }

  const handleDelete = () => {
    if (centroToDelete) {
      setCentros(centros.filter((c) => c.id !== centroToDelete.id))
      setShowDeleteConfirm(false)
      setCentroToDelete(null)
      alert(`El centro ${centroToDelete.descripcion} ha sido eliminado.`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing && editingCentro) {
      const updatedCentro = {
        ...editingCentro,
        ...formData,
      }
      setCentros(centros.map((c) => (c.id === editingCentro.id ? updatedCentro : c)))
      alert("Centro de costo actualizado exitosamente")
    } else {
      const newCentro = {
        id: Math.max(...centros.map((c) => c.id)) + 1,
        ...formData,
      }
      setCentros([...centros, newCentro])
      alert("Nuevo centro de costo creado exitosamente")
    }

    setShowModal(false)
    setIsEditing(false)
    setEditingCentro(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Centro de Costo</h2>
        <Button onClick={() => setShowModal(true)}>Nuevo Centro de Costo</Button>
      </div>

      {showDeleteConfirm && centroToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Está seguro que desea eliminar el centro <span className="font-bold">{centroToDelete.descripcion}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{isEditing ? "Editar Centro de Costo" : "Datos Generales"}</h2>
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  ✕
                </Button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex gap-6 justify-center">
                  {/* Lista lateral */}
                  <div className="w-1/2 border-r pr-4">
                    <div className="border rounded max-h-96 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-blue-600 text-white">
                          <tr>
                            <th className="p-1 text-left">Código</th>
                            <th className="p-1 text-left">Descripción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {centros.map((centro) => (
                            <tr
                              key={centro.id}
                              className={`border-b text-xs ${editingCentro?.id === centro.id ? "bg-blue-100" : ""}`}
                            >
                              <td className="p-1">{centro.codigo}</td>
                              <td className="p-1">{centro.descripcion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Formulario principal centrado */}
                  <div className="w-1/2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Código</Label>
                        <Input
                          value={formData.codigo}
                          onChange={(e) => handleInputChange("codigo", e.target.value)}
                          required
                        />
                      </div>
                      <div></div>
                    </div>

                    <div>
                      <Label>Descripción</Label>
                      <Input
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange("descripcion", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Dirección</Label>
                      <Input
                        value={formData.direccion}
                        onChange={(e) => handleInputChange("direccion", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Referencia</Label>
                      <Input
                        value={formData.referencia}
                        onChange={(e) => handleInputChange("referencia", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>País</Label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={formData.pais}
                        onChange={(e) => handleInputChange("pais", e.target.value)}
                      >
                        <option value="PERU">PERU</option>
                      </select>
                    </div>

                    <div>
                      <Label>Departamento</Label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={formData.departamento}
                        onChange={(e) => handleInputChange("departamento", e.target.value)}
                      >
                        <option value="LA LIBERTAD">LA LIBERTAD</option>
                      </select>
                    </div>

                    <div>
                      <Label>Provincia</Label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={formData.provincia}
                        onChange={(e) => handleInputChange("provincia", e.target.value)}
                      >
                        <option value="TRUJILLO">TRUJILLO</option>
                      </select>
                    </div>

                    <div>
                      <Label>Distrito</Label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={formData.distrito}
                        onChange={(e) => handleInputChange("distrito", e.target.value)}
                      >
                        <option value="TRUJILLO">TRUJILLO</option>
                      </select>
                    </div>

                    <div>
                      <Label>Teléfono-Anexo</Label>
                      <Input
                        value={formData.telefonoAnexo}
                        onChange={(e) => handleInputChange("telefonoAnexo", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Fecha Registro</Label>
                      <Input
                        type="date"
                        value={formData.fechaRegistro}
                        onChange={(e) => handleInputChange("fechaRegistro", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Ámbito</Label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={formData.ambito}
                        onChange={(e) => handleInputChange("ambito", e.target.value)}
                      >
                        <option value="">Seleccionar</option>
                        <option value="LOCAL">LOCAL</option>
                        <option value="REGIONAL">REGIONAL</option>
                        <option value="NACIONAL">NACIONAL</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">{isEditing ? "Actualizar" : "Guardar"}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lista de centros */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Centros de Costo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Código</th>
                  <th className="text-left p-2">Descripción</th>
                  <th className="text-left p-2">Dirección</th>
                  <th className="text-left p-2">Distrito</th>
                  <th className="text-left p-2">Fecha Registro</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {centros.map((centro) => (
                  <tr key={centro.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{centro.codigo}</td>
                    <td className="p-2">{centro.descripcion}</td>
                    <td className="p-2">{centro.direccion}</td>
                    <td className="p-2">{centro.distrito}</td>
                    <td className="p-2">{centro.fechaRegistro}</td>
                    <td className="p-2 space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openModal(centro)}>
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => confirmDelete(centro)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UbicacionModule() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Ubicación Física</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">Módulo de ubicación física en desarrollo...</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportesModule({ userRole }: { userRole: "admin" | "user" }) {
  const [reportes, setReportes] = useState([
    {
      id: 1,
      nombre: "Reporte de Asignación de Bienes",
      fecha: "15/01/2024",
      hora: "14:30",
      tipo: "Asignación de Bienes",
    },
    {
      id: 2,
      nombre: "Inventario Físico - Sede Principal",
      fecha: "12/01/2024",
      hora: "09:15",
      tipo: "Inventario Físico",
    },
    {
      id: 3,
      nombre: "Faltantes de Inventario",
      fecha: "10/01/2024",
      hora: "16:45",
      tipo: "Faltantes de Inventario",
    },
  ])

  const generarReporte = (tipo: string) => {
    const fecha = new Date()
    const fechaStr = fecha.toLocaleDateString("es-ES")
    const horaStr = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })

    let nombre = ""
    switch (tipo) {
      case "asignacion":
        nombre = "Reporte de Asignación de Bienes"
        break
      case "inventario":
        nombre = "Inventario Físico - General"
        break
      case "faltantes":
        nombre = "Faltantes de Inventario"
        break
    }

    const nuevoReporte = {
      id: Math.max(...reportes.map((r) => r.id)) + 1,
      nombre,
      fecha: fechaStr,
      hora: horaStr,
      tipo: nombre,
    }

    setReportes([nuevoReporte, ...reportes])
    alert(`Reporte ("${nombre}") generado exitosamente.`)
  }

  const descargarReporte = (id: number) => {
    const reporte = reportes.find((r) => r.id === id)
    if (reporte) {
      alert(`Descargando reporte: ${reporte.nombre}`)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asignación de Bienes</CardTitle>
            <CardDescription>Reporte de bienes patrimoniales por usuario final</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="w-full" onClick={() => generarReporte("asignacion")}>
              Generar Reporte
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventario Físico</CardTitle>
            <CardDescription>Inventario físico de activos fijos</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="w-full" onClick={() => generarReporte("inventario")}>
              Generar Reporte
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faltantes de Inventario</CardTitle>
            <CardDescription>Reporte de bienes faltantes en inventario</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="w-full" onClick={() => generarReporte("faltantes")}>
              Generar Reporte
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Reportes</CardTitle>
          <CardDescription>Últimos reportes generados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportes.map((reporte) => (
              <div key={reporte.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{reporte.nombre}</h3>
                  <p className="text-sm text-gray-500">
                    Generado el {reporte.fecha} - {reporte.hora}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => descargarReporte(reporte.id)}>
                  Descargar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ImportarModule() {
  const [importaciones, setImportaciones] = useState([
    {
      id: 1,
      nombre: "inventario_siga_enero_2024.xlsx",
      fecha: "15/01/2024",
      registros: 247,
      estado: "Exitoso",
    },
    {
      id: 2,
      nombre: "inventario_siga_diciembre_2023.xlsx",
      fecha: "02/01/2024",
      registros: 198,
      estado: "Exitoso",
    },
  ])

  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivoSeleccionado(e.target.files[0])
    }
  }

  const importarArchivo = () => {
    if (!archivoSeleccionado) {
      alert("Por favor seleccione un archivo para importar.")
      return
    }

    const fecha = new Date()
    const fechaStr = fecha.toLocaleDateString("es-ES")

    const nuevaImportacion = {
      id: Math.max(...importaciones.map((i) => i.id)) + 1,
      nombre: archivoSeleccionado.name,
      fecha: fechaStr,
      registros: Math.floor(Math.random() * 300) + 100, // Simulación de registros
      estado: "Exitoso",
    }

    setImportaciones([nuevaImportacion, ...importaciones])
    setArchivoSeleccionado(null)
    alert("Archivo importado exitosamente.")
  }

  const exportarDatos = () => {
    alert("Datos exportados a archivo TXT exitosamente.")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Importar/Exportar Datos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Importar desde SIGA</CardTitle>
            <CardDescription>Importar archivo XLS obtenido del sistema SIGA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fileInput">Seleccionar archivo XLS</Label>
              <Input id="fileInput" type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="mt-1" />
              <p className="text-sm text-gray-500 mt-1">
                {archivoSeleccionado ? archivoSeleccionado.name : "No se ha seleccionado ningún archivo"}
              </p>
            </div>
            <Button className="w-full" onClick={importarArchivo}>
              Importar Datos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exportar Datos</CardTitle>
            <CardDescription>Exportar inventario actual a archivo TXT</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Datos a exportar:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Código de bien patrimonial</li>
                <li>• Descripción del bien</li>
                <li>• Estado y ubicación</li>
                <li>• Responsable asignado</li>
                <li>• Centro de costo</li>
              </ul>
            </div>
            <Button className="w-full" onClick={exportarDatos}>
              Exportar a TXT
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Importaciones</CardTitle>
          <CardDescription>Registro de las últimas importaciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {importaciones.map((importacion) => (
              <div key={importacion.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{importacion.nombre}</h3>
                  <p className="text-sm text-gray-500">
                    Importado el {importacion.fecha} - {importacion.registros} registros
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    importacion.estado === "Exitoso" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {importacion.estado}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InventarioModule() {
  // Estados para los controles del formulario
  const [añoInventario, setAñoInventario] = useState("2024")
  const [numeroInventario, setNumeroInventario] = useState("INVENTARIO DE BIENES MUEBLES PATRIMONIO")
  const [tipoInventario, setTipoInventario] = useState("OTROS")
  const [tipoRegistro, setTipoRegistro] = useState("Institucional")
  const [fechaRegistro] = useState("23/6/2025") // No editable
  const [filtrarPor, setFiltrarPor] = useState("Descripción")
  const [valorBusqueda, setValorBusqueda] = useState("")

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 10

  // Estado para el modal de activo fijo
  const [showActivoFijoModal, setShowActivoFijoModal] = useState(false)
  const [activoSeleccionado, setActivoSeleccionado] = useState<any>(null)

  // Estado para el modal de registrar inventario
  const [showRegistrarInventarioModal, setShowRegistrarInventarioModal] = useState(false)
  const [formRegistrarInventario, setFormRegistrarInventario] = useState({
    numero: "",
    fecha: new Date().toLocaleDateString("es-ES"),
    nombre: "",
    tipoInventario: "PRESENTACION ANUAL",
  })

  // Estado para el modal de editar activo fijo
  const [showEditarActivoModal, setShowEditarActivoModal] = useState(false)
  const [activoEditando, setActivoEditando] = useState<any>(null)
  const [formEditarActivo, setFormEditarActivo] = useState({
    descripcion: "",
    sede: "",
    centroCosto: "",
    ubicacionFisica: "",
    usuarioFinal: "",
    nroSerie: "",
    marca: "",
    estadoConserv: "",
    estadoUso: "",
    modelo: "",
    caracteristicas: "",
  })

  // Generar años desde 2015 hasta el año actual
  const añosDisponibles = []
  const añoActual = new Date().getFullYear()
  for (let año = añoActual; año >= 2015; año--) {
    añosDisponibles.push(año.toString())
  }

  // Opciones para tipo de registro según la imagen
  const tiposRegistro = [
    "Institucional",
    "No institucional - Bienes cedidos en uso",
    "No institucional - Bienes en Comodato",
    "No institucional - Bienes en Afectación en Uso",
    "No institucional - Bienes Alquilados",
    "No institucionales - Bienes incautados",
  ]

  // Opciones para filtrar por según la imagen
  const opcionesFiltro = ["Descripción", "Sede", "Código", "Centro de Costo", "Ubicación", "Tipo de Verificación"]

  // Datos de ejemplo de activos (simulando 50 registros para 5 páginas)
  const [todosLosActivos, setTodosLosActivos] = useState(() => {
    const activos = []
    for (let i = 1; i <= 50; i++) {
      activos.push({
        item: i,
        codigoPatrimonial: `11223${String(i).padStart(7, "0")}`,
        codigoBarraInvAnterior: `P${String(14253 + i).padStart(5, "0")}`,
        descripcion:
          i === 1
            ? "DESHUMEDECEDOR PARA AMBIENTE TIPO COMERCIAL"
            : i <= 10
              ? `EQUIPO DE AIRE ACONDICIONADO DE PRECISION 24000 BTU - UNIDAD ${i - 1}`
              : `EQUIPO DE OFICINA TIPO ${i}`,
        tipoVerif: "F",
        sede: i <= 10 ? "ARCHIVO CENTRAL" : i <= 20 ? "SEDE PRINCIPAL" : "ASCOPE",
        centroCosto: i <= 10 ? "01.06-ARCHIVO" : i <= 20 ? "01.06-PRINCIPAL" : "02.06-ASCOPE",
        ubicacionFisica: i <= 10 ? "2004-ARCHIVO - PISO 2" : i <= 20 ? "Oficina 201" : "OFICINA 100",
        usuarioFinal: i <= 10 ? "GUERRERO ESCOBEDO JHONY GERHARD" : i <= 20 ? "Juan Pérez" : "MARIA RODRIGUEZ SILVA",
        nroSerie: `DL${String(123456789 + i).padStart(9, "0")}`,
        marca: i <= 10 ? "LG" : i <= 20 ? "Dell" : "HP",
        estadoConserv: i % 3 === 0 ? "Regular" : "Bueno",
        estadoUso: "Si",
        modelo: i <= 10 ? "S/M" : i <= 20 ? "Inspiron 15 3000" : "LaserJet Pro",
        caracteristicas: i <= 10 ? "DESHUMEDECEDOR PARA AMBIENTE TIPO COMERCIAL, M..." : "Equipo para trabajo de oficina",
      })
    }
    return activos
  })

  // Filtrar activos según el criterio seleccionado
  const activosFiltrados = todosLosActivos.filter((activo) => {
    if (!valorBusqueda) return true

    switch (filtrarPor) {
      case "Descripción":
        return activo.descripcion.toLowerCase().includes(valorBusqueda.toLowerCase())
      case "Código":
        return activo.codigoPatrimonial.includes(valorBusqueda)
      case "Sede":
        return activo.sede.toLowerCase().includes(valorBusqueda.toLowerCase())
      case "Centro de Costo":
        return activo.centroCosto.toLowerCase().includes(valorBusqueda.toLowerCase())
      case "Ubicación":
        return activo.ubicacionFisica.toLowerCase().includes(valorBusqueda.toLowerCase())
      default:
        return activo.descripcion.toLowerCase().includes(valorBusqueda.toLowerCase())
    }
  })

  // Calcular paginación
  const totalPaginas = Math.ceil(activosFiltrados.length / itemsPorPagina)
  const indiceInicio = (paginaActual - 1) * itemsPorPagina
  const indiceFin = indiceInicio + itemsPorPagina
  const activosPaginados = activosFiltrados.slice(indiceInicio, indiceFin)

  const abrirModalActivoFijo = (activo: any) => {
    setActivoSeleccionado(activo)
    setShowActivoFijoModal(true)
  }

  const abrirModalEditarActivo = (activo: any) => {
    setActivoEditando(activo)
    setFormEditarActivo({
      descripcion: activo.descripcion,
      sede: activo.sede,
      centroCosto: activo.centroCosto,
      ubicacionFisica: activo.ubicacionFisica,
      usuarioFinal: activo.usuarioFinal,
      nroSerie: activo.nroSerie,
      marca: activo.marca,
      estadoConserv: activo.estadoConserv,
      estadoUso: activo.estadoUso,
      modelo: activo.modelo,
      caracteristicas: activo.caracteristicas,
    })
    setShowEditarActivoModal(true)
  }

  const handleInputEditarActivo = (field: string, value: string) => {
    setFormEditarActivo({ ...formEditarActivo, [field]: value })
  }

  const handleSubmitEditarActivo = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Actualizar el activo en la lista
    setTodosLosActivos(activos => 
      activos.map(activo => 
        activo.item === activoEditando.item 
          ? { 
              ...activo, 
              descripcion: formEditarActivo.descripcion,
              sede: formEditarActivo.sede,
              centroCosto: formEditarActivo.centroCosto,
              ubicacionFisica: formEditarActivo.ubicacionFisica,
              usuarioFinal: formEditarActivo.usuarioFinal,
              nroSerie: formEditarActivo.nroSerie,
              marca: formEditarActivo.marca,
              estadoConserv: formEditarActivo.estadoConserv,
              estadoUso: formEditarActivo.estadoUso,
              modelo: formEditarActivo.modelo,
              caracteristicas: formEditarActivo.caracteristicas,
            }
          : activo
      )
    )
    
    setShowEditarActivoModal(false)
    setActivoEditando(null)
    alert("Activo actualizado exitosamente")
  }

  // Add new state for the seleccionar inventario modal
  const [showSeleccionarInventarioModal, setShowSeleccionarInventarioModal] = useState(false)
  const [formSeleccionarInventario, setFormSeleccionarInventario] = useState({
    año: "2024",
    numeroInventario: "INVENTARIO DE BIENES MUEBLES PATRIMONIO",
    fechaRegistro: "17/01/2025",
    tipoInventario: "OTROS",
    tipoRegistro: "Institucional",
    busqueda: "Descripción",
    terminoBusqueda: "",
    todosVerifFisica: false,
    todosVerifDigital: false,
  })

  // Sample data for the inventory selection table
  const [inventarioItems, setInventarioItems] = useState([
    {
      id: 1,
      codigoPatrimonial: "112228220002",
      codigoBarra: "P14253",
      descripcion: "DESHUMEDECEDOR PARA AMBIENTE TIPO COMERCIAL",
      sede: "ARCHIVO CENTRAL",
      centroCosto: "01.06-ARCHIVO",
      ubicacion: "2004-ARCHIVO - PISO 2",
      responsable: "GUERRERO ESCOBEDO JHONY GERHARD",
      verifFisica: false,
      verifDigital: false,
      selected: false,
    },
    {
      id: 2,
      codigoPatrimonial: "112233360001",
      codigoBarra: "000353",
      descripcion: "EQUIPO DE AIRE ACONDICIONADO DE PRECISION 24000 BTU",
      sede: "ASCOPE",
      centroCosto: "02.06-ASCOPE",
      ubicacion: "OFICINA 100",
      responsable: "MARIA RODRIGUEZ SILVA",
      verifFisica: false,
      verifDigital: false,
      selected: false,
    },
    // Add more sample items as needed
  ])

  // Generate years from current year back to 2010
  const añosSeleccionarInventario = []
  for (let año = añoActual; año >= 2010; año--) {
    añosSeleccionarInventario.push(año.toString())
  }

  const seleccionarInventario = () => {
    setShowSeleccionarInventarioModal(true)
  }

  const handleInputSeleccionarInventario = (field: string, value: string | boolean) => {
    setFormSeleccionarInventario({ ...formSeleccionarInventario, [field]: value })
  }

  const handleTodosVerifFisica = (checked: boolean) => {
    setFormSeleccionarInventario({ 
      ...formSeleccionarInventario, 
      todosVerifFisica: checked,
      todosVerifDigital: checked ? false : formSeleccionarInventario.todosVerifDigital
    })
    
    // Update all items
    setInventarioItems(items => 
      items.map(item => ({
        ...item,
        verifFisica: checked,
        verifDigital: checked ? false : item.verifDigital
      }))
    )
  }

  const handleTodosVerifDigital = (checked: boolean) => {
    setFormSeleccionarInventario({ 
      ...formSeleccionarInventario, 
      todosVerifDigital: checked,
      todosVerifFisica: checked ? false : formSeleccionarInventario.todosVerifFisica
    })
    
    // Update all items
    setInventarioItems(items => 
      items.map(item => ({
        ...item,
        verifDigital: checked,
        verifFisica: checked ? false : item.verifFisica
      }))
    )
  }

  const handleItemVerifFisica = (itemId: number, checked: boolean) => {
    setInventarioItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, verifFisica: checked, verifDigital: checked ? false : item.verifDigital }
          : item
      )
    )
  }

  const handleItemVerifDigital = (itemId: number, checked: boolean) => {
    setInventarioItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, verifDigital: checked, verifFisica: checked ? false : item.verifFisica }
          : item
      )
    )
  }

  const registrarInventario = () => {
    setShowRegistrarInventarioModal(true)
  }

  const handleRegistrarInventario = () => {
    if (!formRegistrarInventario.numero || !formRegistrarInventario.nombre) {
      alert("Por favor complete all the fields")
      return
    }
    alert(`Inventario registrado: ${formRegistrarInventario.nombre}`)
    setShowRegistrarInventarioModal(false)
    setFormRegistrarInventario({
      numero: "",
      fecha: new Date().toLocaleDateString("es-ES"),
      nombre: "",
      tipoInventario: "PRESENTACION ANUAL",
    })
  }

  const handleInputRegistrarInventario = (field: string, value: string) => {
    if (field === "numero") {
      // Solo permitir números
      const numeroValue = value.replace(/[^0-9]/g, "")
      setFormRegistrarInventario({ ...formRegistrarInventario, [field]: numeroValue })
    } else if (field === "nombre") {
      // Solo permitir números y letras
      const nombreValue = value.replace(/[^a-zA-Z0-9\s]/g, "")
      setFormRegistrarInventario({ ...formRegistrarInventario, [field]: nombreValue })
    } else {
      setFormRegistrarInventario({ ...formRegistrarInventario, [field]: value })
    }
  }

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white p-2 text-sm">
        Módulo de Patrimonio - Ejecutora: MINISTERIO PÚBLICO - GERENCIA ADMINISTRATIVA DE LA LIBERTAD
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Listado del Inventario Físico</h2>

        {/* Controles superiores */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label>Año Inventario</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={añoInventario}
              onChange={(e) => setAñoInventario(e.target.value)}
            >
              {añosDisponibles.map((año) => (
                <option key={año} value={año}>
                  {año}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Número Inventario</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={numeroInventario}
              onChange={(e) => setNumeroInventario(e.target.value)}
            >
              <option value="INVENTARIO DE BIENES MUEBLES PATRIMONIO">INVENTARIO DE BIENES MUEBLES PATRIMONIO</option>
            </select>
          </div>

          <div>
            <Label>Fecha Registro</Label>
            <Input value={fechaRegistro} readOnly className="bg-gray-100" />
          </div>

          <div>
            <Label>Tipo Inventario</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={tipoInventario}
              onChange={(e) => setTipoInventario(e.target.value)}
            >
              <option value="OTROS">OTROS</option>
              <option value="PRESENTACION ANUAL">PRESENTACION ANUAL</option>
            </select>
          </div>

          <div>
            <Label>Tipo Registro</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={tipoRegistro}
              onChange={(e) => setTipoRegistro(e.target.value)}
            >
              {tiposRegistro.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={seleccionarInventario} variant="outline">
              Seleccionar Inventario
            </Button>
            <Button onClick={registrarInventario}>Registrar Inventario</Button>
          </div>
        </div>

        {/* Sección de filtros */}
        <div className="space-y-4">
          <h3 className="font-bold">[ Listado de Items por Inventario ]</h3>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Filtrar por:</Label>
              <select
                className="border rounded px-3 py-2"
                value={filtrarPor}
                onChange={(e) => setFiltrarPor(e.target.value)}
              >
                {opcionesFiltro.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Valor de búsqueda:</Label>
              <Input
                placeholder="Ingrese valor a buscar (ej: 01)"
                value={valorBusqueda}
                onChange={(e) => setValorBusqueda(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </div>

        {/* Tabla de activos */}
        <div className="border rounded">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-left">Código Patrimonial</th>
                <th className="p-2 text-left">Código Barra/Inv Anterior</th>
                <th className="p-2 text-left">Descripción</th>
                <th className="p-2 text-left">Tipo Verif</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activosPaginados.map((activo, index) => (
                <tr key={activo.item} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-2">{activo.item}</td>
                  <td className="p-2 font-mono text-sm">{activo.codigoPatrimonial}</td>
                  <td className="p-2">{activo.codigoBarraInvAnterior}</td>
                  <td className="p-2">{activo.descripcion}</td>
                  <td className="p-2 text-center">{activo.tipoVerif}</td>
                  <td className="p-2 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => abrirModalActivoFijo(activo)}>
                      Ver Activo Fijo
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => abrirModalEditarActivo(activo)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación funcional */}
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            ◀
          </Button>
          <span className="text-sm">
            Página {paginaActual} de {totalPaginas} | Mostrando {activosPaginados.length} de {activosFiltrados.length}
            registros
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            ▶
          </Button>
        </div>
      </div>

      {/* Modal de Editar Activo Fijo */}
      {showEditarActivoModal && activoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
              <h2 className="font-bold text-lg">Editar Activo Fijo</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditarActivoModal(false)}
                className="text-white hover:bg-blue-700 text-xl font-bold w-8 h-8 p-0"
              >
                ✕
              </Button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmitEditarActivo} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Item</Label>
                    <Input value={`MP${String(activoEditando.item).padStart(6, "0")}`} readOnly className="bg-gray-100" />
                  </div>
                  <div>
                    <Label>Correlativo</Label>
                    <Input value="00003247" readOnly className="bg-gray-100" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cód. Patrimonial</Label>
                    <Input value={activoEditando.codigoPatrimonial} readOnly className="bg-gray-100" />
                  </div>
                  <div>
                    <Label>Código Barra / Inv. Anterior</Label>
                    <Input value={activoEditando.codigoBarraInvAnterior} readOnly className="bg-gray-100" />
                  </div>
                </div>

                <div>
                  <Label>Descripción *</Label>
                  <Input
                    value={formEditarActivo.descripcion}
                    onChange={(e) => handleInputEditarActivo("descripcion", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Sede *</Label>
                  <Input
                    value={formEditarActivo.sede}
                    onChange={(e) => handleInputEditarActivo("sede", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Centro Costo *</Label>
                  <Input
                    value={formEditarActivo.centroCosto}
                    onChange={(e) => handleInputEditarActivo("centroCosto", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Ubic. Física *</Label>
                  <Input
                    value={formEditarActivo.ubicacionFisica}
                    onChange={(e) => handleInputEditarActivo("ubicacionFisica", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Usuario Final *</Label>
                  <Input
                    value={formEditarActivo.usuarioFinal}
                    onChange={(e) => handleInputEditarActivo("usuarioFinal", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nro Serie *</Label>
                    <Input
                      value={formEditarActivo.nroSerie}
                      onChange={(e) => handleInputEditarActivo("nroSerie", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Estado Conserv *</Label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={formEditarActivo.estadoConserv}
                      onChange={(e) => handleInputEditarActivo("estadoConserv", e.target.value)}
                      required
                    >
                      <option value="Bueno">Bueno</option>
                      <option value="Regular">Regular</option>
                      <option value="Malo">Malo</option>
                      <option value="Muy Malo">Muy Malo</option>
                      <option value="Nuevo">Nuevo</option>
                      <option value="Chatarra">Chatarra</option>
                      <option value="RAEE">RAEE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Marca *</Label>
                    <Input
                      value={formEditarActivo.marca}
                      onChange={(e) => handleInputEditarActivo("marca", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Estado Uso *</Label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={formEditarActivo.estadoUso}
                      onChange={(e) => handleInputEditarActivo("estadoUso", e.target.value)}
                      required
                    >
                      <option value="Si">Si</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Modelo *</Label>
                  <Input
                    value={formEditarActivo.modelo}
                    onChange={(e) => handleInputEditarActivo("modelo", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Características *</Label>
                  <textarea
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    value={formEditarActivo.caracteristicas}
                    onChange={(e) => handleInputEditarActivo("caracteristicas", e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowEditarActivoModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Cambios</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registrar Inventario */}
      {showRegistrarInventarioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="bg-blue-600 text-white p-3 rounded-t-lg">
              <h3 className="font-bold">Generar Inventario Físico</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Label>Número</Label>
                <Input
                  placeholder="Ingrese número"
                  value={formRegistrarInventario.numero}
                  onChange={(e) => handleInputRegistrarInventario("numero", e.target.value)}
                />
              </div>
              <div>
                <Label>Fecha</Label>
                <Input value={formRegistrarInventario.fecha} readOnly className="bg-gray-100" />
              </div>
              <div>
                <Label>Nombre</Label>
                <Input
                  placeholder="Ingrese nombre del inventario"
                  value={formRegistrarInventario.nombre}
                  onChange={(e) => handleInputRegistrarInventario("nombre", e.target.value)}
                />
              </div>
              <div>
                <Label>Tipo Inventario</Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={formRegistrarInventario.tipoInventario}
                  onChange={(e) => handleInputRegistrarInventario("tipoInventario", e.target.value)}
                >
                  <option value="PRESENTACION ANUAL">PRESENTACION ANUAL</option>
                  <option value="OTROS">OTROS</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowRegistrarInventarioModal(false)}>
                  Salir
                </Button>
                <Button onClick={handleRegistrarInventario}>Guardar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Datos del Activo Fijo - Nuevo diseño */}
      {showActivoFijoModal && activoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
              <h2 className="font-bold text-lg">Datos del Activo Fijo</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActivoFijoModal(false)}
                className="text-white hover:bg-blue-700 text-xl font-bold w-8 h-8 p-0"
              >
                ✕
              </Button>
            </div>

            <div className="p-6">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <tbody>
                  {/* Primera fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 w-32 font-medium">Item</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value="112228220001"
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 w-32 font-medium">Correlativo</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value="00003247"
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 w-32 font-medium">Tipo Patrimonio</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value="Bienes Muebles"
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                  </tr>

                  {/* Segunda fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Cód. Patrimonial</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={activoSeleccionado.codigoPatrimonial}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Estado</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value="Activo Fijo"
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium" colSpan={2}>
                      <input
                        type="text"
                        value="Muebles y Enseres"
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                  </tr>

                  {/* Tercera fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Código Barra/Inv. Anterior</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={activoSeleccionado.codigoBarraInvAnterior}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Fecha Ingreso</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value="01/01/2019"
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Nro Serie</td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={activoSeleccionado.nroSerie}
                          readOnly
                          className="flex-1 h-6 text-xs px-1 bg-gray-100 border-0"
                        />
                        <span className="text-xs">Estado Conserv</span>
                        <select
                          disabled
                          className="h-6 text-xs px-1 bg-gray-100 border border-gray-300"
                          defaultValue={activoSeleccionado.estadoConserv}
                        >
                          <option value="BUENO">BUENO</option>
                          <option value="REGULAR">REGULAR</option>
                          <option value="MALO">MALO</option>
                          <option value="MUY MALO">MUY MALO</option>
                          <option value="NUEVO">NUEVO</option>
                          <option value="CHATARRA">CHATARRA</option>
                          <option value="RAEE">RAEE</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  {/* Cuarta fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Descripción</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={activoSeleccionado.descripcion}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Marca</td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={activoSeleccionado.marca}
                          readOnly
                          className="flex-1 h-6 text-xs px-1 bg-gray-100 border-0"
                        />
                        <span className="text-xs">Estado Uso</span>
                        <select
                          disabled
                          className="h-6 text-xs px-1 bg-gray-100 border border-gray-300"
                          defaultValue={activoSeleccionado.estadoUso}
                        >
                          <option value="Si">Si</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Modelo</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={activoSeleccionado.modelo}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                  </tr>

                  {/* Quinta fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Sede</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={activoSeleccionado.sede}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Medidas</td>
                    <td className="border border-gray-300 p-2">
                      <input type="text" value="" readOnly className="w-full h-6 text-xs px-1 bg-gray-100 border-0" />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium" colSpan={2}></td>
                  </tr>

                  {/* Sexta fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Centro Costo</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={activoSeleccionado.centroCosto}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Características</td>
                    <td className="border border-gray-300 p-2" colSpan={3}>
                      <input
                        type="text"
                        value={activoSeleccionado.caracteristicas}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                  </tr>

                  {/* Séptima fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Ubic. Física</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={activoSeleccionado.ubicacionFisica}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Observaciones</td>
                    <td className="border border-gray-300 p-2" colSpan={3}>
                      <input
                        type="text"
                        value="LIB-009458-24"
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                  </tr>

                  {/* Octava fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Responsable</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={activoSeleccionado.usuarioFinal}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium" colSpan={4}></td>
                  </tr>

                  {/* Novena fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Usuario Final</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={activoSeleccionado.usuarioFinal}
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium" colSpan={4}></td>
                  </tr>

                  {/* Décima fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Tipo Ingreso</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value="INVENTARIO INICIAL"
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Cta Contable</td>
                    <td className="border border-gray-300 p-2" colSpan={3}>
                      <input
                        type="text"
                        value="150302090l-AIRE ACONDICIONADO Y REFRIGERACIÓN"
                        readOnly
                        className="w-full h-6 text-xs px-1 bg-gray-100 border-0"
                      />
                    </td>
                  </tr>

                  {/* Última fila */}
                  <tr>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Verif. Física/Digital</td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex items-center gap-1">
                        <input type="checkbox" checked disabled className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium">Etiquetado</td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex items-center gap-1">
                        <input type="checkbox" disabled className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2 bg-gray-200 font-medium" colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleccionar Inventario */}
      {showSeleccionarInventarioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-3 rounded-t-lg">
              <h3 className="font-bold text-lg">Registro del Inventario Físico</h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Form controls */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Año Inventario</Label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formSeleccionarInventario.año}
                    onChange={(e) => handleInputSeleccionarInventario("año", e.target.value)}
                  >
                    {añosSeleccionarInventario.map((año) => (
                      <option key={año} value={año}>
                        {año}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label>Número Inventario</Label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formSeleccionarInventario.numeroInventario}
                    onChange={(e) => handleInputSeleccionarInventario("numeroInventario", e.target.value)}
                  >
                    <option value="INVENTARIO DE BIENES MUEBLES PATRIMONIO">INVENTARIO DE BIENES MUEBLES PATRIMONIO</option>
                  </select>
                </div>
                
                <div>
                  <Label>Fecha Registro</Label>
                  <Input value={formSeleccionarInventario.fechaRegistro} readOnly className="bg-gray-100" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo Inventario</Label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formSeleccionarInventario.tipoInventario}
                    onChange={(e) => handleInputSeleccionarInventario("tipoInventario", e.target.value)}
                  >
                    <option value="OTROS">OTROS</option>
                    <option value="PRESENTACION ANUAL">PRESENTACION ANUAL</option>
                  </select>
                </div>
                
                <div>
                  <Label>Tipo Registro</Label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formSeleccionarInventario.tipoRegistro}
                    onChange={(e) => handleInputSeleccionarInventario("tipoRegistro", e.target.value)}
                  >
                    {tiposRegistro.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Search section */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">[ Listado de Items ]</h4>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Label>Búsqueda</Label>
                    <select
                      className="border rounded px-3 py-2"
                      value={formSeleccionarInventario.busqueda}
                      onChange={(e) => handleInputSeleccionarInventario("busqueda", e.target.value)}
                    >
                      {opcionesFiltro.map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Input
                    placeholder="Ingrese término de búsqueda"
                    value={formSeleccionarInventario.terminoBusqueda}
                    onChange={(e) => handleInputSeleccionarInventario("terminoBusqueda", e.target.value)}
                    className="w-64"
                  />
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formSeleccionarInventario.todosVerifFisica}
                        onChange={(e) => handleTodosVerifFisica(e.target.checked)}
                      />
                      <span className="text-sm">Todos Verific. Física</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formSeleccionarInventario.todosVerifDigital}
                        onChange={(e) => handleTodosVerifDigital(e.target.checked)}
                      />
                      <span className="text-sm">Todos Verific. Digital</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Data table */}
              <div className="border rounded max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-600 text-white sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Sel</th>
                      <th className="p-2 text-left">Código Patrimonial</th>
                      <th className="p-2 text-left">Código Barra</th>
                      <th className="p-2 text-left">Descripción</th>
                      <th className="p-2 text-left">Verific. Física</th>
                      <th className="p-2 text-left">Verific. Digital</th>
                      <th className="p-2 text-left">Editar</th>
                      <th className="p-2 text-left">Sede</th>
                      <th className="p-2 text-left">Centro de Costo</th>
                      <th className="p-2 text-left">Ubicación</th>
                      <th className="p-2 text-left">Responsable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventarioItems.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={(e) => {
                              setInventarioItems(items => 
                                items.map(i => 
                                  i.id === item.id ? { ...i, selected: e.target.checked } : i
                                )
                              )
                            }}
                          />
                        </td>
                        <td className="p-2 font-mono text-xs">{item.codigoPatrimonial}</td>
                        <td className="p-2 text-xs">{item.codigoBarra}</td>
                        <td className="p-2 text-xs">{item.descripcion}</td>
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={item.verifFisica}
                            onChange={(e) => handleItemVerifFisica(item.id, e.target.checked)}
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={item.verifDigital}
                            onChange={(e) => handleItemVerifDigital(item.id, e.target.checked)}
                          />
                        </td>
                        <td className="p-2">
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                            Editar
                          </Button>
                        </td>
                        <td className="p-2 text-xs">{item.sede}</td>
                        <td className="p-2 text-xs">{item.centroCosto}</td>
                        <td className="p-2 text-xs">{item.ubicacion}</td>
                        <td className="p-2 text-xs">{item.responsable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowSeleccionarInventarioModal(false)}>
                  Salir
                </Button>
                <Button onClick={() => setShowSeleccionarInventarioModal(false)}>
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
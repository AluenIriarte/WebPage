param(
  [string]$InputPath = (Join-Path $PSScriptRoot "..\outbound\data\raw\Base_prospecting_unificada.xlsx"),
  [string]$OutputDir = (Join-Path $PSScriptRoot "..\outbound\data\prospects"),
  [int]$InitialBatchSize = 150
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$FinalColumns = @(
  "id",
  "company_name",
  "website",
  "domain",
  "email",
  "email_type",
  "contact_route",
  "contact_name",
  "contact_role",
  "industry",
  "sub_industry",
  "company_type",
  "country",
  "province",
  "city",
  "icp_fit",
  "icp_score",
  "priority",
  "source",
  "campaign_segment",
  "sequence_id",
  "sequence_step",
  "status",
  "tags",
  "validation_flags",
  "last_sent_at",
  "next_send_at",
  "replied_at",
  "bounced_at",
  "unsubscribed_at",
  "do_not_contact_reason",
  "notes",
  "created_at",
  "updated_at"
)

$FreeEmailDomains = @(
  "gmail.com",
  "gmail.com.ar",
  "hotmail.com",
  "hotmail.com.ar",
  "hotmail.es",
  "outlook.com",
  "outlook.com.ar",
  "live.com",
  "live.com.ar",
  "yahoo.com",
  "yahoo.com.ar",
  "yahoo.es",
  "yahoo.com.mx",
  "yahoo.com.br",
  "icloud.com",
  "msn.com",
  "aol.com",
  "gmx.com",
  "mail.com",
  "proton.me",
  "protonmail.com",
  "fibertel.com.ar",
  "speedy.com.ar",
  "arnet.com.ar",
  "arnetbiz.com.ar",
  "ciudad.com.ar",
  "navego.com.ar",
  "uolsinectis.com.ar",
  "fullzero.com.ar",
  "sinectis.com.ar",
  "entelnet.bo",
  "preentelnet.bo",
  "cotapnet.com.bo",
  "coteornet.com.bo"
)

$SalesLocals = @(
  "ventas",
  "venta",
  "comercial",
  "comerciales",
  "cotizaciones",
  "cotizacion",
  "presupuestos",
  "presupuesto",
  "pedidos",
  "clientes"
)

$AdminLocals = @(
  "administracion",
  "admin",
  "compras",
  "gerencia",
  "direccion",
  "facturacion",
  "contabilidad",
  "tesoreria",
  "rrhh"
)

function Normalize-Text {
  param([object]$Value)
  if ($null -eq $Value) {
    return ""
  }
  return ([string]$Value).Trim() -replace "\s+", " "
}

function Normalize-Key {
  param([object]$Value)
  $text = (Normalize-Text $Value).ToLowerInvariant()
  $normalized = $text.Normalize([Text.NormalizationForm]::FormD)
  $builder = New-Object Text.StringBuilder
  foreach ($char in $normalized.ToCharArray()) {
    $category = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($char)
    if ($category -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$builder.Append($char)
    }
  }
  return $builder.ToString().Normalize([Text.NormalizationForm]::FormC)
}

function Add-Unique {
  param(
    [System.Collections.Generic.List[string]]$List,
    [string]$Value
  )
  $clean = Normalize-Text $Value
  if ($clean -and -not $List.Contains($clean)) {
    [void]$List.Add($clean)
  }
}

function Is-ValidEmail {
  param([string]$Email)
  $emailClean = (Normalize-Text $Email).ToLowerInvariant()
  return $emailClean -match "^[^@\s]+@[^@\s]+\.[^@\s]+$"
}

function Get-EmailDomain {
  param([string]$Email)
  $emailClean = (Normalize-Text $Email).ToLowerInvariant()
  if ($emailClean -notmatch "@") {
    return ""
  }
  return ($emailClean.Split("@")[-1]).Trim(".")
}

function Get-EmailLocal {
  param([string]$Email)
  $emailClean = (Normalize-Text $Email).ToLowerInvariant()
  if ($emailClean -notmatch "@") {
    return ""
  }
  return ($emailClean.Split("@")[0]).Trim()
}

function Is-FreeEmailDomain {
  param([string]$Domain)
  return $FreeEmailDomains -contains (Normalize-Text $Domain).ToLowerInvariant()
}

function Get-DomainFromWebsite {
  param(
    [string]$Website,
    [string]$Email
  )

  $websiteClean = Normalize-Text $Website
  if ($websiteClean) {
    $candidate = $websiteClean
    if ($candidate -notmatch "^[a-zA-Z][a-zA-Z0-9+.-]*://") {
      $candidate = "https://$candidate"
    }

    try {
      $uri = [Uri]$candidate
      $domainHost = $uri.Host.ToLowerInvariant()
      if ($domainHost.StartsWith("www.")) {
        $domainHost = $domainHost.Substring(4)
      }
      if ($domainHost) {
        return $domainHost.Trim(".")
      }
    } catch {
      $withoutScheme = ($websiteClean -replace "^[a-zA-Z][a-zA-Z0-9+.-]*://", "")
      $domainHost = ($withoutScheme.Split("/")[0]).ToLowerInvariant()
      if ($domainHost.StartsWith("www.")) {
        $domainHost = $domainHost.Substring(4)
      }
      if ($domainHost) {
        return $domainHost.Trim(".")
      }
    }
  }

  return Get-EmailDomain $Email
}

function Get-StableId {
  param([string]$Seed)
  $bytes = [Text.Encoding]::UTF8.GetBytes($Seed)
  $sha = [Security.Cryptography.SHA256]::Create()
  try {
    $hash = $sha.ComputeHash($bytes)
    return (($hash | ForEach-Object { $_.ToString("x2") }) -join "").Substring(0, 16)
  } finally {
    $sha.Dispose()
  }
}

function Read-Worksheet {
  param(
    [object]$Workbook,
    [string]$SheetName
  )

  $worksheet = $Workbook.Worksheets.Item($SheetName)
  $range = $worksheet.UsedRange
  $values = $range.Value2
  $rowCount = $range.Rows.Count
  $columnCount = $range.Columns.Count

  $headers = @()
  for ($column = 1; $column -le $columnCount; $column++) {
    $headers += Normalize-Text $values[1, $column]
  }

  $rows = New-Object "System.Collections.Generic.List[object]"
  for ($row = 2; $row -le $rowCount; $row++) {
    $object = [ordered]@{}
    $hasValue = $false
    for ($column = 1; $column -le $columnCount; $column++) {
      $header = $headers[$column - 1]
      if (-not $header) {
        continue
      }
      $value = Normalize-Text $values[$row, $column]
      if ($value) {
        $hasValue = $true
      }
      $object[$header] = $value
    }
    if ($hasValue) {
      [void]$rows.Add([PSCustomObject]$object)
    }
  }

  return $rows
}

function Get-Cell {
  param(
    [object]$Row,
    [string]$Name
  )

  if ($Row.PSObject.Properties.Name -contains $Name) {
    return Normalize-Text $Row.$Name
  }

  return ""
}

function Get-EmailType {
  param(
    [string]$Email,
    [string]$RawType,
    [string]$Quality
  )

  $raw = Normalize-Key $RawType
  $qualityKey = Normalize-Key $Quality
  $domain = Get-EmailDomain $Email
  $local = Get-EmailLocal $Email

  if (-not (Is-ValidEmail $Email)) {
    if ($qualityKey -eq "missing" -or -not $Email) {
      return "missing"
    }
    return "invalid"
  }

  if (Is-FreeEmailDomain $domain) {
    return "free_email"
  }

  if ($SalesLocals -contains $local) {
    return "role_sales"
  }

  if ($AdminLocals -contains $local) {
    return "role_admin"
  }

  if ($raw -eq "named_corporate") {
    return "personal_corporate"
  }

  if ($raw -eq "generic_corporate") {
    return "generic_company"
  }

  if ($raw -eq "personal_mail_provider") {
    return "free_email"
  }

  return "personal_corporate"
}

function Get-ContactRoute {
  param(
    [string]$EmailType,
    [string]$Phone
  )

  switch ($EmailType) {
    "personal_corporate" { return "direct_person" }
    "role_sales" { return "sales_inbox" }
    "role_admin" { return "general_inbox" }
    "generic_company" { return "general_inbox" }
    "free_email" { return "general_inbox" }
    default {
      if (Normalize-Text $Phone) {
        return "phone_only"
      }
      return "unknown"
    }
  }
}

function Get-ContactRole {
  param(
    [string]$ContactName,
    [string]$Notes
  )

  $text = Normalize-Key "$ContactName $Notes"
  if ($text -match "gerente|manager|director|direccion|ceo|owner|duen") {
    return "decision_maker"
  }
  if ($text -match "compras|abastecimiento|supply") {
    return "purchasing"
  }
  if ($text -match "ventas|comercial") {
    return "commercial"
  }
  if ($text -match "operaciones|operacion|planta|produccion|equipos|mantenimiento") {
    return "operations"
  }
  if ((Normalize-Text $ContactName) -and $text -notmatch "info|ventas|comercial|administracion|contacto") {
    return "named_contact"
  }
  return "unknown"
}

function Get-IndustryInfo {
  param(
    [string]$Segment,
    [string]$CompanyName,
    [string]$Notes
  )

  $text = Normalize-Key "$Segment $CompanyName $Notes"

  if ($text -match "ferreter|corralon|construccion|materiales") {
    return @{ Industry = "ferreteria_construccion"; SubIndustry = "ferreteria_distribucion"; CompanyType = "distributor" }
  }

  if ($text -match "distrib|mayorista|mayor|representante|representaciones|insumos") {
    return @{ Industry = "distribucion_b2b"; SubIndustry = "mayorista"; CompanyType = "distributor" }
  }

  if ($text -match "minera|mineria|petrol|lithium|litio|arenas|pumps|bombas") {
    return @{ Industry = "industrial"; SubIndustry = "mineria_energia"; CompanyType = "service_company" }
  }

  if ($text -match "fundidor|industria|quimic|farmaceut|cosmetic|bebida|proteina|medicina") {
    return @{ Industry = "industrial"; SubIndustry = "manufactura"; CompanyType = "manufacturer" }
  }

  if ($text -match "agro|agric|fruti|hortic|ganad|apic|aceitun|floric") {
    return @{ Industry = "agroindustrial"; SubIndustry = "produccion_agro"; CompanyType = "producer" }
  }

  if ($text -match "cotillon|retail|local") {
    return @{ Industry = "retail"; SubIndustry = "retail_especializado"; CompanyType = "retailer" }
  }

  return @{ Industry = "unknown"; SubIndustry = "unknown"; CompanyType = "unknown" }
}

function Get-CommercialSignals {
  param(
    [string]$Segment,
    [string]$CompanyName,
    [string]$Notes,
    [string]$Website
  )

  $text = Normalize-Key "$Segment $CompanyName $Notes $Website"
  return @{
    HasDistribution = $text -match "distrib|mayorista|mayor|comercializ|representante|representaciones"
    HasIndustrial = $text -match "industrial|industria|minera|mineria|fundidor|quimic|farmaceut|cosmetic|bebida|petrol|lithium|litio"
    HasAgro = $text -match "agro|agric|fruti|hortic|ganad|apic|aceitun|floric"
    HasComplexity = $text -match "sucursal|sucursales|catalogo|producto|productos|marca|marcas|zona|regional|nacional|ventas|cotiza|cotizar|equipo"
    HasNegativeIntent = $text -match "no contactar|no molestar|unsubscribe|desuscrip|baja explicita"
    NeedsPause = $text -match "dieron de baja|no estan adquiriendo|no necesita|por ahora|futuros trabajos"
    HasPriorSalesContext = $text -match "cotiz|prototipo|muestra|nos contacta|seguir|seguimiento|contactado|followup|follow-up|\bmail\b|urgente|proyecto"
    IsPublicSector = $text -match "\.gov\.ar|gobierno|municipal|universidad|cnea"
  }
}

function Get-Score {
  param(
    [string]$EmailType,
    [string]$Website,
    [string]$Domain,
    [string]$ContactName,
    [string]$ContactRole,
    [hashtable]$IndustryInfo,
    [hashtable]$Signals,
    [int]$DomainContactCount,
    [int]$CompanyContactCount
  )

  $score = 0

  switch ($EmailType) {
    "personal_corporate" { $score += 20 }
    "role_sales" { $score += 17 }
    "role_admin" { $score += 12 }
    "generic_company" { $score += 11 }
    "free_email" { $score += 4 }
    default { $score += 0 }
  }

  switch ($IndustryInfo.CompanyType) {
    "distributor" { $score += 25 }
    "wholesaler" { $score += 25 }
    "manufacturer" { $score += 20 }
    "service_company" { $score += 18 }
    "producer" { $score += 14 }
    "retailer" { $score += 8 }
    default { $score += 8 }
  }

  $complexity = 0
  if (Normalize-Text $Website) { $complexity += 6 }
  if ($DomainContactCount -ge 3 -or $CompanyContactCount -ge 3) { $complexity += 9 }
  elseif ($DomainContactCount -eq 2 -or $CompanyContactCount -eq 2) { $complexity += 5 }
  if ($Signals.HasComplexity) { $complexity += 6 }
  if ($ContactRole -in @("decision_maker", "commercial", "operations", "purchasing")) { $complexity += 4 }
  elseif (Normalize-Text $ContactName) { $complexity += 2 }
  $score += [Math]::Min(25, $complexity)

  $webSignals = 0
  if (Normalize-Text $Website) { $webSignals += 8 }
  if ($Domain -and -not (Is-FreeEmailDomain $Domain)) { $webSignals += 4 }
  if ($Signals.HasDistribution -or $Signals.HasIndustrial) { $webSignals += 5 }
  elseif ($Signals.HasAgro) { $webSignals += 3 }
  if ($DomainContactCount -ge 2 -or $CompanyContactCount -ge 2) { $webSignals += 3 }
  $score += [Math]::Min(20, $webSignals)

  if ($Signals.HasDistribution) { $score += 10 }
  elseif ($Signals.HasIndustrial) { $score += 8 }
  elseif ($Signals.HasAgro) { $score += 6 }
  else { $score += 4 }

  if ($EmailType -eq "free_email") { $score -= 10 }
  if (-not (Normalize-Text $Website)) { $score -= 8 }
  if ($Signals.NeedsPause) { $score -= 12 }
  if ($Signals.IsPublicSector) { $score -= 15 }
  if ($EmailType -in @("missing", "invalid")) { $score = 0 }

  return [Math]::Max(0, [Math]::Min(100, [int]$score))
}

function Get-Fit {
  param([int]$Score)
  if ($Score -ge 80) { return @{ IcpFit = "high"; Priority = "A" } }
  if ($Score -ge 60) { return @{ IcpFit = "medium"; Priority = "B" } }
  if ($Score -ge 40) { return @{ IcpFit = "low"; Priority = "C" } }
  return @{ IcpFit = "not_fit"; Priority = "D" }
}

function Get-CampaignSegment {
  param(
    [string]$Status,
    [hashtable]$IndustryInfo,
    [string]$Priority
  )

  if ($Status -in @("pending", "paused", "do_not_contact")) {
    return "revision_manual"
  }
  if ($Priority -in @("A", "B")) {
    if ($IndustryInfo.CompanyType -in @("distributor", "wholesaler")) {
      return "distribuidores_prioridad_a_b"
    }
    if ($IndustryInfo.Industry -eq "industrial") {
      return "industrial_b2b_test"
    }
    if ($IndustryInfo.Industry -eq "agroindustrial") {
      return "agroindustrial_test"
    }
    if ($IndustryInfo.Industry -eq "ferreteria_construccion") {
      return "ferreterias_test"
    }
  }
  if ($Priority -eq "C") {
    return "baja_prioridad_test"
  }
  return "revision_manual"
}

function Get-StatusAndReason {
  param(
    [string]$EmailType,
    [int]$Score,
    [hashtable]$Signals,
    [System.Collections.Generic.List[string]]$Flags
  )

  if ($Signals.HasNegativeIntent) {
    return @{ Status = "do_not_contact"; Reason = "negative_contact_preference" }
  }
  if ($EmailType -eq "missing") {
    return @{ Status = "do_not_contact"; Reason = "missing_email" }
  }
  if ($EmailType -eq "invalid") {
    return @{ Status = "do_not_contact"; Reason = "invalid_email" }
  }
  if ($Flags.Contains("possible_individual_producer")) {
    return @{ Status = "pending"; Reason = "" }
  }
  if ($Signals.IsPublicSector) {
    return @{ Status = "paused"; Reason = "possible_public_sector" }
  }
  if ($Signals.NeedsPause) {
    return @{ Status = "paused"; Reason = "negative_or_stale_intent_in_notes" }
  }
  if ($Signals.HasPriorSalesContext) {
    return @{ Status = "pending"; Reason = "" }
  }
  if ($Score -ge 55 -and $EmailType -ne "free_email") {
    return @{ Status = "approved"; Reason = "" }
  }
  if ($Score -ge 40) {
    return @{ Status = "pending"; Reason = "" }
  }
  return @{ Status = "paused"; Reason = "low_icp_score" }
}

function Select-BestDuplicate {
  param([object[]]$Records)

  return $Records |
    Sort-Object `
      @{ Expression = { if (Get-Cell $_ "email_quality" -eq "valid") { 1 } else { 0 } }; Descending = $true },
      @{ Expression = { if (Get-Cell $_ "website") { 1 } else { 0 } }; Descending = $true },
      @{ Expression = { if (Get-Cell $_ "contact_name") { 1 } else { 0 } }; Descending = $true },
      @{ Expression = { (Get-Cell $_ "notes").Length }; Descending = $true } |
    Select-Object -First 1
}

function Convert-ToFinalRow {
  param(
    [object]$Row,
    [hashtable]$EmailCounts,
    [hashtable]$DomainCounts,
    [hashtable]$CompanyCounts,
    [datetime]$Now
  )

  $companyName = Normalize-Text (Get-Cell $Row "company_name")
  $email = (Normalize-Text (Get-Cell $Row "email")).ToLowerInvariant()
  $website = Normalize-Text (Get-Cell $Row "website")
  $domain = Get-DomainFromWebsite $website $email
  $contactName = Normalize-Text (Get-Cell $Row "contact_name")
  $segment = Normalize-Text (Get-Cell $Row "segment")
  $notes = Normalize-Text (Get-Cell $Row "notes")
  $sourceFiles = Normalize-Text (Get-Cell $Row "source_files")
  $sourceRows = Normalize-Text (Get-Cell $Row "source_rows")
  $province = Normalize-Text (Get-Cell $Row "province")
  $city = Normalize-Text (Get-Cell $Row "locality")
  $phone = Normalize-Text (Get-Cell $Row "phone")
  $crmStage = Normalize-Text (Get-Cell $Row "crm_stage")
  $responseStatus = Normalize-Text (Get-Cell $Row "response_status")
  $followupStatus = Normalize-Text (Get-Cell $Row "followup_status")
  $webNote = Normalize-Text (Get-Cell $Row "web_note")
  $webSourceUrl = Normalize-Text (Get-Cell $Row "web_source_url")
  $emailQuality = Normalize-Text (Get-Cell $Row "email_quality")
  $rawEmailType = Normalize-Text (Get-Cell $Row "email_type")
  $companyKey = Normalize-Key $companyName

  $emailType = Get-EmailType $email $rawEmailType $emailQuality
  $contactRoute = Get-ContactRoute $emailType $phone
  $contactRole = Get-ContactRole $contactName $notes
  $industryInfo = Get-IndustryInfo $segment $companyName $notes
  $signals = Get-CommercialSignals $segment $companyName "$notes $crmStage $responseStatus $followupStatus" $website
  if ($domain -match "(^|\.)gov\.|(^|\.)gob\.|(^|\.)edu\.|(^|\.)mil\.") {
    $signals.IsPublicSector = $true
  }

  $domainCount = 0
  if ($domain -and $DomainCounts.ContainsKey($domain)) {
    $domainCount = [int]$DomainCounts[$domain]
  }
  $companyCount = 0
  if ($companyKey -and $CompanyCounts.ContainsKey($companyKey)) {
    $companyCount = [int]$CompanyCounts[$companyKey]
  }

  $score = Get-Score `
    -EmailType $emailType `
    -Website $website `
    -Domain $domain `
    -ContactName $contactName `
    -ContactRole $contactRole `
    -IndustryInfo $industryInfo `
    -Signals $signals `
    -DomainContactCount $domainCount `
    -CompanyContactCount $companyCount

  $fit = Get-Fit $score
  $flags = New-Object "System.Collections.Generic.List[string]"
  $tags = New-Object "System.Collections.Generic.List[string]"

  if (-not $email) { Add-Unique $flags "missing_email" }
  elseif (-not (Is-ValidEmail $email)) { Add-Unique $flags "invalid_email" }
  if ($emailType -eq "free_email") { Add-Unique $flags "free_email" }
  if ($emailType -in @("generic_company", "role_admin")) { Add-Unique $flags "generic_email" }
  if (-not $website) { Add-Unique $flags "missing_website" }
  if ($email -and $EmailCounts.ContainsKey($email) -and [int]$EmailCounts[$email] -gt 1) { Add-Unique $flags "duplicate_email" }
  if ($domain -and $DomainCounts.ContainsKey($domain) -and [int]$DomainCounts[$domain] -gt 1) { Add-Unique $flags "duplicate_domain" }
  if ($signals.IsPublicSector) { Add-Unique $flags "possible_public_sector" }
  if ($signals.HasPriorSalesContext) { Add-Unique $flags "possible_prior_sales_context" }
  if ($score -lt 40) { Add-Unique $flags "possible_bad_fit" }
  if ($industryInfo.CompanyType -eq "producer" -and $companyName -match ",") {
    Add-Unique $flags "possible_individual_producer"
  }
  if ($emailType -in @("missing", "invalid", "free_email") -or -not $website -or $signals.NeedsPause -or $signals.IsPublicSector -or $signals.HasPriorSalesContext) {
    Add-Unique $flags "needs_manual_review"
  }
  if ($flags.Contains("possible_individual_producer")) {
    Add-Unique $flags "needs_manual_review"
  }

  Add-Unique $tags "test_pool"
  Add-Unique $tags $industryInfo.Industry
  Add-Unique $tags $industryInfo.SubIndustry
  Add-Unique $tags $industryInfo.CompanyType
  if ($signals.HasDistribution) { Add-Unique $tags "distribucion" }
  if ($signals.HasIndustrial) { Add-Unique $tags "industrial" }
  if ($signals.HasAgro) { Add-Unique $tags "agro" }
  if ($signals.HasComplexity) { Add-Unique $tags "posible_complejidad_comercial" }
  if ($domainCount -ge 2 -or $companyCount -ge 2) { Add-Unique $tags "multi_contacto" }
  if ($website) { Add-Unique $tags "web_activa" } else { Add-Unique $tags "sin_web" }
  switch ($emailType) {
    "personal_corporate" { Add-Unique $tags "email_personal" }
    "role_sales" { Add-Unique $tags "email_ventas" }
    "generic_company" { Add-Unique $tags "email_generico" }
    "free_email" { Add-Unique $tags "email_gratuito" }
  }
  if ($fit.Priority -in @("A", "B")) { Add-Unique $tags "alta_prioridad" }
  if ($fit.Priority -in @("C", "D")) { Add-Unique $tags "baja_prioridad" }
  if ($domain -match "\.ar$" -or $province) { Add-Unique $tags "argentina" }

  $statusInfo = Get-StatusAndReason $emailType $score $signals $flags
  if ($statusInfo.Status -eq "approved") {
    Add-Unique $flags "ready_to_import"
  }
  $campaignSegment = Get-CampaignSegment $statusInfo.Status $industryInfo $fit.Priority

  $country = "unknown"
  if ($domain -match "\.ar$" -or $province) {
    $country = "Argentina"
  }

  $source = "Contactos_Master"
  if ($sourceFiles) {
    $source = $sourceFiles
  }
  if ($sourceRows) {
    $source = "$source row:$sourceRows"
  }

  $noteParts = New-Object "System.Collections.Generic.List[string]"
  if ($notes) { Add-Unique $noteParts "notes: $notes" }
  if ($crmStage) { Add-Unique $noteParts "crm_stage: $crmStage" }
  if ($responseStatus) { Add-Unique $noteParts "response_status: $responseStatus" }
  if ($followupStatus) { Add-Unique $noteParts "followup_status: $followupStatus" }
  if ($webNote) { Add-Unique $noteParts "web_note: $webNote" }
  if ($webSourceUrl) { Add-Unique $noteParts "web_source_url: $webSourceUrl" }

  $seed = if ($email) { $email } elseif ($domain) { "$companyName|$domain" } else { "$companyName|$source" }

  return [PSCustomObject][ordered]@{
    id = Get-StableId $seed
    company_name = $companyName
    website = $website
    domain = $domain
    email = $email
    email_type = $emailType
    contact_route = $contactRoute
    contact_name = $contactName
    contact_role = $contactRole
    industry = $industryInfo.Industry
    sub_industry = $industryInfo.SubIndustry
    company_type = $industryInfo.CompanyType
    country = $country
    province = $province
    city = $city
    icp_fit = $fit.IcpFit
    icp_score = $score
    priority = $fit.Priority
    source = $source
    campaign_segment = $campaignSegment
    sequence_id = "dashboard_comercial_test_v1"
    sequence_step = 0
    status = $statusInfo.Status
    tags = ($tags -join ",")
    validation_flags = ($flags -join ",")
    last_sent_at = ""
    next_send_at = ""
    replied_at = ""
    bounced_at = ""
    unsubscribed_at = ""
    do_not_contact_reason = $statusInfo.Reason
    notes = ($noteParts -join " | ")
    created_at = $Now.ToString("s") + "Z"
    updated_at = $Now.ToString("s") + "Z"
  }
}

function To-FinalColumnOrder {
  param([object]$Row)

  $ordered = [ordered]@{}
  foreach ($column in $FinalColumns) {
    $property = $Row.PSObject.Properties[$column]
    $ordered[$column] = if ($property) { $property.Value } else { "" }
  }
  return [PSCustomObject]$ordered
}

if (-not (Test-Path -LiteralPath $InputPath)) {
  throw "Input workbook not found: $InputPath"
}

New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
  $workbook = $excel.Workbooks.Open((Resolve-Path -LiteralPath $InputPath).Path, $null, $true)
  $rawRows = @(Read-Worksheet $workbook "Contactos_Master")
  $workbook.Close($false)
} finally {
  if ($workbook) {
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($workbook) | Out-Null
  }
  $excel.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}

$emailGroups = @{}
foreach ($row in $rawRows) {
  $email = (Normalize-Text (Get-Cell $row "email")).ToLowerInvariant()
  $key = if ($email) { $email } else { "missing::$([guid]::NewGuid().ToString())" }
  if (-not $emailGroups.ContainsKey($key)) {
    $emailGroups[$key] = New-Object "System.Collections.Generic.List[object]"
  }
  [void]$emailGroups[$key].Add($row)
}

$dedupedRows = New-Object "System.Collections.Generic.List[object]"
foreach ($group in $emailGroups.Values) {
  [void]$dedupedRows.Add((Select-BestDuplicate -Records @($group.ToArray())))
}

$emailCounts = @{}
$domainCounts = @{}
$companyCounts = @{}

foreach ($row in $dedupedRows) {
  $email = (Normalize-Text (Get-Cell $row "email")).ToLowerInvariant()
  if ($email) {
    $emailCounts[$email] = 1 + [int]$emailCounts[$email]
  }

  $domain = Get-DomainFromWebsite (Get-Cell $row "website") $email
  if ($domain) {
    $domainCounts[$domain] = 1 + [int]$domainCounts[$domain]
  }

  $companyKey = Normalize-Key (Get-Cell $row "company_name")
  if ($companyKey) {
    $companyCounts[$companyKey] = 1 + [int]$companyCounts[$companyKey]
  }
}

$now = [DateTime]::UtcNow
$finalRows = foreach ($row in $dedupedRows) {
  $converted = Convert-ToFinalRow $row $emailCounts $domainCounts $companyCounts $now
  To-FinalColumnOrder -Row $converted
}

$finalRows = @($finalRows | Sort-Object `
  @{ Expression = { $_.status -eq "approved" }; Descending = $true },
  @{ Expression = { [int]$_.icp_score }; Descending = $true },
  @{ Expression = { $_.company_name }; Ascending = $true },
  @{ Expression = { $_.email }; Ascending = $true })

$selectedDomains = @{}
$selectedCompanies = @{}
$initialBatch = New-Object "System.Collections.Generic.List[object]"
foreach ($row in $finalRows) {
  if ($initialBatch.Count -ge $InitialBatchSize) {
    break
  }
  if ($row.status -ne "approved") {
    continue
  }
  if ($row.priority -notin @("A", "B")) {
    continue
  }
  if ($row.email_type -in @("free_email", "missing", "invalid")) {
    continue
  }
  if ($row.validation_flags -match "needs_manual_review|possible_public_sector") {
    continue
  }

  $domainKey = if ($row.domain) { $row.domain } else { "domain::$($row.id)" }
  $companyKey = Normalize-Key $row.company_name
  if ($selectedDomains.ContainsKey($domainKey) -or ($companyKey -and $selectedCompanies.ContainsKey($companyKey))) {
    continue
  }

  $selectedDomains[$domainKey] = $true
  if ($companyKey) {
    $selectedCompanies[$companyKey] = $true
  }
  [void]$initialBatch.Add($row)
}

$needsReview = @($finalRows | Where-Object { $_.status -in @("pending", "paused") })

$finalPath = Join-Path $OutputDir "prospects_final.csv"
$batchPath = Join-Path $OutputDir "prospects_initial_150.csv"
$reviewPath = Join-Path $OutputDir "prospects_needs_review.csv"
$summaryPath = Join-Path $OutputDir "prospects_summary.md"

$finalRows | Export-Csv -LiteralPath $finalPath -NoTypeInformation -Encoding UTF8
$initialBatch | Export-Csv -LiteralPath $batchPath -NoTypeInformation -Encoding UTF8
$needsReview | Export-Csv -LiteralPath $reviewPath -NoTypeInformation -Encoding UTF8

$statusLines = $finalRows | Group-Object status | Sort-Object Count -Descending | ForEach-Object { "- $($_.Name): $($_.Count)" }
$priorityLines = $finalRows | Group-Object priority | Sort-Object Name | ForEach-Object { "- $($_.Name): $($_.Count)" }
$segmentLines = $finalRows | Group-Object campaign_segment | Sort-Object Count -Descending | ForEach-Object { "- $($_.Name): $($_.Count)" }
$emailTypeLines = $finalRows | Group-Object email_type | Sort-Object Count -Descending | ForEach-Object { "- $($_.Name): $($_.Count)" }

$summary = @(
  "# Prospect Scoring Summary",
  "",
  "Generated: $($now.ToString("s"))Z",
  "",
  "## Files",
  "",
  "- Final table: $finalPath",
  "- Initial batch: $batchPath",
  "- Needs review: $reviewPath",
  "",
  "## Totals",
  "",
  "- Raw Contactos_Master rows: $($rawRows.Count)",
  "- Final deduplicated rows: $($finalRows.Count)",
  "- Initial batch rows: $($initialBatch.Count)",
  "",
  "## Status",
  "",
  ($statusLines -join "`n"),
  "",
  "## Priority",
  "",
  ($priorityLines -join "`n"),
  "",
  "## Email Types",
  "",
  ($emailTypeLines -join "`n"),
  "",
  "## Campaign Segments",
  "",
  ($segmentLines -join "`n"),
  "",
  "## Selection Rules For Initial Batch",
  "",
  "- status = approved",
  "- priority = A or B",
  "- corporate or role-based email only",
  "- no public-sector flag",
  "- no manual-review flag",
  "- one contact per company/domain"
)

$summary -join "`n" | Set-Content -LiteralPath $summaryPath -Encoding UTF8

[PSCustomObject]@{
  final_path = $finalPath
  initial_batch_path = $batchPath
  needs_review_path = $reviewPath
  summary_path = $summaryPath
  raw_rows = $rawRows.Count
  final_rows = $finalRows.Count
  initial_batch_rows = $initialBatch.Count
}

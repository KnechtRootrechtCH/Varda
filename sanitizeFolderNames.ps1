$folders = Get-ChildItem | Where-Object { $_.PSIsContainer } | Where-Object { -not $_.Name.StartsWith("[") }
Write-Host "Found $($folders.length) folders..."
$regex = "(.+?)([1,2]\d{3})(?:.*)"

for ($i = 0; $i -le $folders.length; $i++) {
  $percentage = 100 * $i / $folders.length
  $folder = $folders[$i]
  Write-Progress -Activity "Sanitizing $($folder.Name)" -Status "$i/$($folders.length)" -PercentComplete $percentage;
  #Write-Host $folder

  $year = $null
  $name = $folder.Name
  $title = $name

  $match = [regex]::Match($name, $regex)
  if ($match.Success) {
    $title = $match.captures.groups[1]
    $year = $match.captures.groups[2]
  } else {
    continue
  }

  $title = $title -replace "\.", " "
  $title = $title.Trim()

  $newName = $title  
  if (-not [string]::IsNullOrEmpty($year)) {
    $newName = "$title ($year)"
  }

  $increment = 0;
  $targetName = $newName;

  if (-not [string]::IsNullOrEmpty($name) -and -not [string]::IsNullOrEmpty($targetName)) {
    while (Test-Path ".\$targetName") {
      $increment++;
      $postfix = "Alternate"
      if ($increment -gt 1) {
        $postfix = "$postfix $increment"
      }
      $targetName = "$newName - $postfix"
    }
    
    Write-Host "`nRenaming: '$name' -> '$targetName'"
    Rename-Item -Path ".\$name" -NewName "$targetName"
  }
}

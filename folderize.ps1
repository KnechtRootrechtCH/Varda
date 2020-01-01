Get-ChildItem . |% {
    $name = $_.Basename
    Write-Host $name
    if ($name -ne "folderize") {
        mkdir "./$name" | Out-Null
        mv $_ "./$name"
    }
}
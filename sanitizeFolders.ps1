$extensions = @('.xml', '.html', '.htm', '.txt', '.nfo', '.url')
$folders = @('proof', 'sample')

$items = Get-ChildItem . -r
Write-Host "Found $($items.length) items in folder, starting sanitizising process..."
$filesDeleted = 0
$foldersDeleted = 0
for ($i = 0; $i -le $items.length; $i++) {
    $item = $items[$i]
    $percentage = 100 * $i / $items.length
    Write-Progress -Activity "Sanitizing $($item.Name)" -Status "$i/$($items.length)" -PercentComplete $percentage;
    if($item -is [System.IO.DirectoryInfo]) {
        $folders |% {
            if ($_ -ieq $item.Name ){
                $folder = $_.ToUpper();
                Write-Debug "$folder folder found => Deleting: $($item.FullName)"
                $item.Delete($true)
                $foldersDeleted++
            }
        }
    } else {
        $extensions |% {
            if($_ -ieq $item.Extension){
                $extension = $_.ToUpper();
                Write-Debug "$extension file found => Deleting: $($item.FullName)"
                $item.Delete()
                $filesDeleted++
            }
        }
    }
}
Write-Host "`n`n$filesDeleted files and $foldersDeleted folders deleted"
Write-Host "Don't forget to delete *sample files!!!"
$targetFolder=".\largef\"
$targetFile=".\largef.zip"
Write-Output "Remove largef folder"
Remove-Item $targetFolder -Recurse -Force
Get-ChildItem $targetFolder

Remove-Item $targetFile
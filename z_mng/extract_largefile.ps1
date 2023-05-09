#----------------------------------------------------
#  extract largef.zip
#  way of extract:
#    user: copy largef.zip VRMViewMeister/ directly.
#    this: unzip largef.zip
#    this: cd largef/
#    this: call deploy_largefile.bat
#
#----------------------------------------------------
$zipFile = "largef.zip"
$unzipFolder = "largef"

if (Test-Path $zipFile) {
    Write-Output "Found $zipFile .Extract..."
    Expand-Archive $zipFile -DestinationPath $unzipFolder
    Write-Output "Extracted."
    Write-Output "Next is copy to original folder."
    Copy-Item "$unzipFolder\public" . -Force -Recurse
    Write-Output "Finished copy."
}else{
    Write-Output "Not found $zipFile . "
}
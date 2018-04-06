require_relative '../src/angband_dump'

RSpec.describe AngbandDump do
  subject { described_class }

  let!(:lines) { IO.readlines 'spec/fixtures/tiny_dump.txt' }
  let(:file_name) { 'file.txt' }

  describe 'an instance of AngbandDump' do
    before { allow(IO).to receive(:readlines).and_return(lines) }
    subject { super().new(file_name) }

    let(:read_path) { 'data/dumpstore/file.txt' }

    it 'has a file_name method' do
      expect(subject.file_name).to eq file_name
    end

    it 'reads the filename from the data/dumpstore folder' do
      expect(IO).to receive(:readlines).once.with(read_path)
      subject
    end

    it 'knows the version of the character' do
      expect(subject.version).to eq 'Angband 9.9.9'
    end

    it 'knows the class of the character' do
      expect(subject.profession).to eq 'Warrior'
    end

    it 'knows the race of the character' do
      expect(subject.race).to eq 'Human'
    end

    it 'knows the history of the character' do
      expect(subject.history).not_to be_nil
    end

    context 'the character history' do
    end

    describe '#write!' do
      subject { super().write! }

      it 'is defined' do
        expect(subject).to be_nil
      end
    end
  end
end
